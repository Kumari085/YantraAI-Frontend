import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import wsService from '../services/websocket';
import uploadApi from '../services/upload.api';
import modelsApi from '../services/models.api';
import { CONFIG } from '../services/config';

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  // Current active conversation session
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return localStorage.getItem('aegis_last_session') || `conv_${Date.now()}`;
  });

  // Conversations list for sidebar
  const [conversations, setConversations] = useState([
    {
      id: 'conv_sample_1',
      title: 'Pressure Vessel Hydrostatic Safety Audit',
      createdAt: Date.now() - 3600000 * 2,
      updatedAt: Date.now() - 3600000 * 2,
      mode: 'agent',
      modelId: 'model-reasoning-qwen',
    },
    {
      id: 'conv_sample_2',
      title: 'Turbine Blade Optical Defect Scan',
      createdAt: Date.now() - 3600000 * 24,
      updatedAt: Date.now() - 3600000 * 24,
      mode: 'agent',
      modelId: 'model-vision-internvl',
    },
  ]);

  // Messages in current session
  const [messages, setMessages] = useState([]);

  // Active run configuration
  const [runMode, setRunMode] = useState(CONFIG.DEFAULT_RUN_MODE); // 'agent' | 'normal' | 'tool'
  const [modelMode, setModelMode] = useState(CONFIG.DEFAULT_MODEL_MODE); // 'auto' | 'manual'
  const [requestedModelId, setRequestedModelId] = useState('model-reasoning-qwen');
  const [activeTools, setActiveTools] = useState([
    'tool-file-read',
    'tool-ocr',
    'tool-vision',
    'tool-rag',
    'tool-code-execution',
  ]);
  const [attachments, setAttachments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  // Real-time Agent Execution State
  const [isGenerating, setIsGenerating] = useState(false);
  const [heartbeatText, setHeartbeatText] = useState('');
  const [currentModelRoute, setCurrentModelRoute] = useState(null);
  const [currentPlan, setCurrentPlan] = useState([]);
  const [toolSteps, setToolSteps] = useState([]);
  const [citations, setCitations] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [activeTurnStats, setActiveTurnStats] = useState(null);

  // Keep a ref to streamingContent to avoid closure capture in event listeners
  const streamingRef = useRef('');
  streamingRef.current = streamingContent;

  // Save active session to localStorage
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('aegis_last_session', currentSessionId);
    }
  }, [currentSessionId]);

  // Subscribe to WebSocket events for currentSessionId
  useEffect(() => {
    if (!currentSessionId) return;

    const unsubscribe = wsService.subscribeSession(currentSessionId, (envelope) => {
      const { type, payload } = envelope;

      switch (type) {
        case 'heartbeat':
          setHeartbeatText(payload.text || 'Processing...');
          break;

        case 'model_route':
          setCurrentModelRoute(payload);
          break;

        case 'plan':
          setCurrentPlan(payload.steps || []);
          break;

        case 'plan_update':
          setCurrentPlan((prevSteps) =>
            prevSteps.map((step) =>
              step.id === payload.id ? { ...step, status: payload.status } : step
            )
          );
          break;

        case 'tool_step':
          setToolSteps((prev) => {
            const exists = prev.some(
              (t) => t.plan_step_id === payload.plan_step_id && t.tool_call?.toolId === payload.tool_call?.toolId
            );
            if (exists) {
              return prev.map((t) =>
                t.plan_step_id === payload.plan_step_id && t.tool_call?.toolId === payload.tool_call?.toolId
                  ? payload
                  : t
              );
            }
            return [...prev, payload];
          });
          break;

        case 'tool_step_update':
          setToolSteps((prev) =>
            prev.map((t) => {
              if (
                t.plan_step_id === payload.plan_step_id &&
                t.tool_call?.toolId === payload.tool_call?.toolId
              ) {
                return {
                  ...t,
                  tool_call: {
                    ...t.tool_call,
                    ...payload.tool_call,
                  },
                };
              }
              return t;
            })
          );
          break;

        case 'citation':
          setCitations((prev) => {
            if (prev.some((c) => c.marker === payload.marker)) return prev;
            return [...prev, payload];
          });
          break;

        case 'artifact':
          setArtifacts((prev) => {
            if (prev.some((a) => a.id === payload.id)) {
              return prev.map((a) => (a.id === payload.id ? payload : a));
            }
            return [...prev, payload];
          });
          break;

        case 'message_chunk':
          setStreamingContent((prev) => prev + (payload.content || ''));
          break;

        case 'final':
          setIsGenerating(false);
          setHeartbeatText('');
          setActiveTurnStats({
            tokens_used: payload.tokens_used,
            tokens_per_sec: payload.tokens_per_sec,
            total_duration_ms: payload.total_duration_ms,
          });

          // Finalize assistant message into history
          const finalAssistantMessage = {
            id: payload.message_id || `msg_asst_${Date.now()}`,
            sender: 'assistant',
            content: payload.content || streamingRef.current,
            timestamp: new Date().toISOString(),
            modelRoute: currentModelRoute,
            plan: currentPlan,
            toolSteps: toolSteps,
            citations: payload.citations || citations,
            artifacts: payload.artifact_ids || artifacts,
            stats: {
              tokens_used: payload.tokens_used,
              tokens_per_sec: payload.tokens_per_sec,
              total_duration_ms: payload.total_duration_ms,
            },
          };

          setMessages((prev) => [...prev, finalAssistantMessage]);
          setStreamingContent('');
          break;

        default:
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentSessionId, currentModelRoute, currentPlan, toolSteps, citations, artifacts]);

  // Send a user prompt turn
  const sendMessage = useCallback(
    (promptText) => {
      if (!promptText.trim() && attachments.length === 0) return;

      const userMsgId = `msg_user_${Date.now()}`;
      const userMessage = {
        id: userMsgId,
        sender: 'user',
        content: promptText,
        attachments: [...attachments],
        timestamp: new Date().toISOString(),
        runMode,
        modelMode,
      };

      // Add user message to history
      setMessages((prev) => [...prev, userMessage]);

      // Reset turn state
      setIsGenerating(true);
      setHeartbeatText('AegisAI sovereign orchestrator initializing...');
      setCurrentModelRoute(null);
      setCurrentPlan([]);
      setToolSteps([]);
      setCitations([]);
      setArtifacts([]);
      setStreamingContent('');
      setActiveTurnStats(null);

      // Check if conversation title needs initialization
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === currentSessionId);
        const title = promptText.length > 42 ? promptText.slice(0, 42) + '...' : promptText || 'New Multimodal Task';
        if (!exists) {
          return [
            {
              id: currentSessionId,
              title,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              mode: runMode,
              modelId: requestedModelId,
            },
            ...prev,
          ];
        }
        return prev;
      });

      // Send WebSocket envelope
      wsService.sendUserMessage(currentSessionId, {
        prompt: promptText,
        runMode,
        modelMode,
        requestedModelId: modelMode === 'manual' ? requestedModelId : null,
        activeTools,
        attachments,
      });

      // Clear attachments after sending
      setAttachments([]);
    },
    [currentSessionId, runMode, modelMode, requestedModelId, activeTools, attachments]
  );

  // Cancel turn
  const cancelGeneration = useCallback(() => {
    wsService.sendSessionControl(currentSessionId, 'cancel');
    setIsGenerating(false);
    setHeartbeatText('Operation cancelled by operator');
  }, [currentSessionId]);

  // Handle artifact approval
  const approveArtifact = useCallback(
    (artifactId, action, comment = '') => {
      wsService.sendApprovalAction(currentSessionId, artifactId, action, comment);
      setArtifacts((prev) =>
        prev.map((art) => (art.id === artifactId ? { ...art, approvalStatus: action } : art))
      );
    },
    [currentSessionId]
  );

  // New conversation
  const createNewConversation = useCallback(() => {
    const newId = `conv_${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([]);
    setIsGenerating(false);
    setHeartbeatText('');
    setCurrentModelRoute(null);
    setCurrentPlan([]);
    setToolSteps([]);
    setCitations([]);
    setArtifacts([]);
    setStreamingContent([]);
    setAttachments([]);
  }, []);

  // Switch conversation
  const switchConversation = useCallback((convId) => {
    setCurrentSessionId(convId);
    setMessages([]);
    setIsGenerating(false);
    setHeartbeatText('');
    setCurrentModelRoute(null);
    setCurrentPlan([]);
    setToolSteps([]);
    setCitations([]);
    setArtifacts([]);
    setStreamingContent('');
    setAttachments([]);
  }, []);

  // Delete conversation
  const deleteConversation = useCallback((convId) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (convId === currentSessionId) {
      createNewConversation();
    }
  }, [currentSessionId, createNewConversation]);

  // Handle file upload and attachment
  const attachFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList);
    for (const file of files) {
      const tempId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const newAttachment = {
        id: tempId,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        status: 'uploading',
        progress: 0,
        fileRef: file,
      };

      setAttachments((prev) => [...prev, newAttachment]);

      try {
        // Attempt upload to backend
        const uploaded = await uploadApi.uploadFile(file, (progress) => {
          setAttachments((prev) =>
            prev.map((a) => (a.id === tempId ? { ...a, progress } : a))
          );
        });

        setAttachments((prev) =>
          prev.map((a) =>
            a.id === tempId
              ? { ...a, id: uploaded.file_id || tempId, status: 'ready', progress: 100 }
              : a
          )
        );
      } catch (err) {
        // In air-gapped simulation fallback, mark ready locally
        console.warn('Backend upload skipped or offline, staging locally:', err.message);
        setAttachments((prev) =>
          prev.map((a) =>
            a.id === tempId ? { ...a, status: 'ready', progress: 100 } : a
          )
        );
      }
    }
  }, []);

  const removeAttachment = useCallback((attId) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        currentSessionId,
        conversations,
        messages,
        runMode,
        setRunMode,
        modelMode,
        setModelMode,
        requestedModelId,
        setRequestedModelId,
        activeTools,
        setActiveTools,
        attachments,
        attachFiles,
        removeAttachment,
        isGenerating,
        heartbeatText,
        currentModelRoute,
        currentPlan,
        toolSteps,
        citations,
        artifacts,
        streamingContent,
        activeTurnStats,
        sendMessage,
        cancelGeneration,
        approveArtifact,
        createNewConversation,
        switchConversation,
        deleteConversation,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

export default WorkspaceContext;
