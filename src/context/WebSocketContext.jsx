import React, { createContext, useContext, useEffect, useState } from 'react';
import wsService, { WS_STATUS } from '../services/websocket';
import mockSimulator from '../services/mockSimulator';
import { CONFIG } from '../services/config';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState(wsService.getStatus());
  const [telemetry, setTelemetry] = useState({
    gpu_util_pct: 54,
    vram_used_gb: 38,
    vram_total_gb: 80,
    vram_by_model: [
      { model_id: 'model-reasoning-qwen', gb: 24 },
      { model_id: 'model-vision-internvl', gb: 8 },
      { model_id: 'model-coding-deepseek', gb: 6 },
    ],
  });
  const [networkAudit, setNetworkAudit] = useState({
    event: 'heartbeat_ok',
    verdict: 'enforced',
    process: 'aegis-airgap-kernel',
    destination: '0.0.0.0 (AIRGAP LOCK)',
    count_since_start: 142,
  });

  useEffect(() => {
    // Register status change listener
    const unsubStatus = wsService.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    // Wire simulation bridge if enabled
    if (CONFIG.ENABLE_SIMULATOR_FALLBACK) {
      wsService.setSimulatorBridge(mockSimulator);
    }

    // Subscribe to global background telemetry and network audit events
    const unsubGlobal = wsService.subscribeGlobal((envelope) => {
      if (envelope.type === 'telemetry' && envelope.payload) {
        setTelemetry(envelope.payload);
      } else if (envelope.type === 'network_audit' && envelope.payload) {
        setNetworkAudit(envelope.payload);
      }
    });

    // Initiate connection
    wsService.connect();

    // Start mock background emitters if in fallback mode
    if (CONFIG.ENABLE_SIMULATOR_FALLBACK) {
      mockSimulator.startBackgroundEmitters((envelope) => {
        if (envelope.type === 'telemetry' && envelope.payload) {
          setTelemetry(envelope.payload);
        } else if (envelope.type === 'network_audit' && envelope.payload) {
          setNetworkAudit(envelope.payload);
        }
      });
    }

    return () => {
      unsubStatus();
      unsubGlobal();
      mockSimulator.stopBackgroundEmitters();
      wsService.disconnect();
    };
  }, []);

  const reconnect = () => {
    wsService.disconnect();
    wsService.connect();
  };

  return (
    <WebSocketContext.Provider
      value={{
        connectionStatus,
        isConnected: connectionStatus === WS_STATUS.CONNECTED,
        isConnecting: connectionStatus === WS_STATUS.CONNECTING || connectionStatus === WS_STATUS.RECONNECTING,
        isOffline: connectionStatus === WS_STATUS.OFFLINE || connectionStatus === WS_STATUS.DISCONNECTED,
        telemetry,
        networkAudit,
        reconnect,
        wsService,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;
