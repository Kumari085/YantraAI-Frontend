import { CONFIG } from './config';

/**
 * WebSocket Connection States
 */
export const WS_STATUS = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  RECONNECTING: 'RECONNECTING',
  DISCONNECTED: 'DISCONNECTED',
  OFFLINE: 'OFFLINE',
};

class AegisWebSocketService {
  constructor() {
    this.ws = null;
    this.status = WS_STATUS.DISCONNECTED;
    this.url = CONFIG.WS_URL;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = CONFIG.WS_MAX_RECONNECT_ATTEMPTS;
    this.reconnectInterval = CONFIG.WS_RECONNECT_INTERVAL_MS;
    this.reconnectTimer = null;
    this.seqCounter = 0;
    this.messageQueue = [];
    
    // Listeners maps:
    // sessionListeners: session_id -> Set(callback)
    // globalListeners: Set(callback)
    // statusListeners: Set(callback)
    this.sessionListeners = new Map();
    this.globalListeners = new Set();
    this.statusListeners = new Set();
    this.simulatorBridge = null;
  }

  /**
   * Set simulation bridge fallback for offline/demo testing
   */
  setSimulatorBridge(bridge) {
    this.simulatorBridge = bridge;
  }

  /**
   * Get current WebSocket connection status
   */
  getStatus() {
    return this.status;
  }

  /**
   * Update internal status and notify listeners
   */
  _setStatus(newStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusListeners.forEach((callback) => {
        try {
          callback(newStatus);
        } catch (e) {
          console.error('Error in status listener:', e);
        }
      });
    }
  }

  /**
   * Subscribe to connection status changes
   */
  onStatusChange(callback) {
    this.statusListeners.add(callback);
    callback(this.status);
    return () => this.statusListeners.delete(callback);
  }

  /**
   * Subscribe to events for a specific session_id
   */
  subscribeSession(sessionId, callback) {
    if (!this.sessionListeners.has(sessionId)) {
      this.sessionListeners.set(sessionId, new Set());
    }
    this.sessionListeners.get(sessionId).add(callback);

    return () => {
      const listeners = this.sessionListeners.get(sessionId);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.sessionListeners.delete(sessionId);
        }
      }
    };
  }

  /**
   * Subscribe to all incoming events (e.g. telemetry, network audits)
   */
  subscribeGlobal(callback) {
    this.globalListeners.add(callback);
    return () => this.globalListeners.delete(callback);
  }

  /**
   * Connect to the backend WebSocket
   */
  connect(token = null) {
    // If already connected or connecting, skip
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // Build URL with optional session token
    let wsUrl = this.url;
    const sessionToken = token || localStorage.getItem('aegis_session_token');
    if (sessionToken) {
      const delimiter = wsUrl.includes('?') ? '&' : '?';
      wsUrl = `${wsUrl}${delimiter}session_token=${encodeURIComponent(sessionToken)}`;
    }

    this._setStatus(this.reconnectAttempts > 0 ? WS_STATUS.RECONNECTING : WS_STATUS.CONNECTING);

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this._setStatus(WS_STATUS.CONNECTED);
        
        // Flush any queued messages
        while (this.messageQueue.length > 0) {
          const envelope = this.messageQueue.shift();
          this.sendRaw(envelope);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const envelope = JSON.parse(event.data);
          this._handleIncomingEnvelope(envelope);
        } catch (err) {
          console.error('Failed to parse WebSocket message JSON:', err, event.data);
        }
      };

      this.ws.onclose = (event) => {
        this.ws = null;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this._setStatus(WS_STATUS.RECONNECTING);
          this._scheduleReconnect();
        } else {
          this._setStatus(WS_STATUS.OFFLINE);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('WebSocket connection error (Air-Gapped Local Mode):', err);
        // Let onclose handle retry logic
      };
    } catch (e) {
      console.warn('WebSocket instantiation failed:', e);
      this._setStatus(WS_STATUS.OFFLINE);
      this._scheduleReconnect();
    }
  }

  /**
   * Disconnect the WebSocket
   */
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close(1000, 'Client closed connection');
      this.ws = null;
    }
    this._setStatus(WS_STATUS.DISCONNECTED);
  }

  /**
   * Schedule exponential backoff reconnection
   */
  _scheduleReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1), 20000);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  /**
   * Dispatch incoming envelope to session listeners and global listeners
   */
  _handleIncomingEnvelope(envelope) {
    const { session_id } = envelope;

    // Dispatch to global listeners
    this.globalListeners.forEach((callback) => {
      try {
        callback(envelope);
      } catch (e) {
        console.error('Error in global event listener:', e);
      }
    });

    // Dispatch to session-specific listeners
    if (session_id && this.sessionListeners.has(session_id)) {
      const listeners = this.sessionListeners.get(session_id);
      listeners.forEach((callback) => {
        try {
          callback(envelope);
        } catch (e) {
          console.error(`Error in session listener (${session_id}):`, e);
        }
      });
    }
  }

  /**
   * Send a raw universal envelope over the WebSocket or through simulator if offline
   */
  sendRaw(envelope) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(envelope));
      return true;
    }

    // If fallback simulator is enabled and socket is not open, route to simulator bridge
    if (CONFIG.ENABLE_SIMULATOR_FALLBACK && this.simulatorBridge) {
      this.simulatorBridge.handleClientEnvelope(envelope, (replyEnvelope) => {
        this._handleIncomingEnvelope(replyEnvelope);
      });
      return true;
    }

    // Otherwise queue message for when socket opens
    this.messageQueue.push(envelope);
    return false;
  }

  /**
   * Format and send user_message (Initiating a Chat Turn)
   */
  sendUserMessage(sessionId, messagePayload) {
    const envelope = {
      type: 'user_message',
      session_id: sessionId,
      seq: ++this.seqCounter,
      timestamp: new Date().toISOString(),
      payload: {
        conversation_id: sessionId,
        project_id: messagePayload.projectId || null,
        run_mode: messagePayload.runMode || 'agent', // 'normal' | 'agent' | 'tool'
        tool_id: messagePayload.toolId || null,
        prompt: messagePayload.prompt,
        model_mode: messagePayload.modelMode || 'auto', // 'auto' | 'manual'
        requested_model_id: messagePayload.requestedModelId || null,
        active_tools: messagePayload.activeTools || ['tool-file-read', 'tool-ocr', 'tool-vision', 'tool-rag', 'tool-code-execution'],
        attachments: messagePayload.attachments || [],
        temperature: messagePayload.temperature ?? 0.2,
        top_p: messagePayload.topP ?? 0.95,
        max_tokens: messagePayload.maxTokens ?? 4096,
      },
    };

    return this.sendRaw(envelope);
  }

  /**
   * Format and send session_control (Cancel, Resume, Regenerate, Branch)
   */
  sendSessionControl(sessionId, action, options = {}) {
    const envelope = {
      type: 'session_control',
      session_id: sessionId,
      seq: ++this.seqCounter,
      timestamp: new Date().toISOString(),
      payload: {
        action, // 'cancel' | 'resume' | 'regenerate' | 'branch'
        since_seq: options.sinceSeq,
        message_id: options.messageId,
      },
    };

    return this.sendRaw(envelope);
  }

  /**
   * Format and send approval_action for deliverables/artifacts
   */
  sendApprovalAction(sessionId, artifactId, action, comment = '', approvedBy = 'Security Officer') {
    const envelope = {
      type: 'approval_action',
      session_id: sessionId,
      seq: ++this.seqCounter,
      timestamp: new Date().toISOString(),
      payload: {
        artifact_id: artifactId,
        action, // 'approve' | 'request_changes' | 'reject'
        comment,
        approved_by: approvedBy,
      },
    };

    return this.sendRaw(envelope);
  }

  /**
   * Custom registry upserts
   */
  sendToolUpsert(toolData) {
    const envelope = {
      type: 'tool_upsert',
      session_id: null,
      seq: ++this.seqCounter,
      timestamp: new Date().toISOString(),
      payload: { tool: toolData },
    };
    return this.sendRaw(envelope);
  }
}

// Export singleton instance
export const wsService = new AegisWebSocketService();
export default wsService;
