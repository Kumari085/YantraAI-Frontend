import React, { useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import ChatMessage from './ChatMessage';
import EmptyWelcomeState from './EmptyWelcomeState';
import AgentActivity from '../agent/AgentActivity';
import CitationList from '../citations/CitationList';
import ArtifactCard from '../artifacts/ArtifactCard';
import { Shield, Sparkles, FileText } from 'lucide-react';

export const ChatWindow = () => {
  const {
    messages,
    isGenerating,
    heartbeatText,
    currentModelRoute,
    currentPlan,
    toolSteps,
    citations,
    artifacts,
    streamingContent,
  } = useWorkspace();

  const scrollBottomRef = useRef(null);

  // Auto-scroll when messages or streaming content update
  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, currentPlan, toolSteps]);

  const isEmpty = messages.length === 0 && !isGenerating && !streamingContent;

  if (isEmpty) {
    return <EmptyWelcomeState />;
  }

  return (
    <div className="flex-1 overflow-y-auto w-full py-4 space-y-2">
      {/* Historical Messages */}
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}

      {/* Active Live Streaming Turn */}
      {isGenerating && (
        <div className="py-4 px-4 sm:px-6 bg-[#0a0d14]/60 border-y border-slate-800/80 animate-in fade-in duration-150">
          <div className="max-w-3xl mx-auto flex items-start gap-3.5">
            {/* Shield Avatar */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-sky-950 to-[#0c1018] border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-glow-cyan animate-pulse">
                <Shield size={15} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-200">YantraAIw</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Orchestrating Sovereign Loop
                </span>
              </div>

              {/* Real-time Agent Activity Trace */}
              <AgentActivity
                plan={currentPlan}
                isGenerating={isGenerating}
              />

              {/* Streaming token text */}
              {streamingContent && (
                <div className="text-sm font-sans text-slate-200 leading-relaxed break-words mt-3">
                  <span className="whitespace-pre-wrap">{streamingContent}</span>
                  <span className="inline-block w-1.5 h-4 ml-1 bg-sky-400 animate-cursor-blink align-middle" />
                </div>
              )}

              {/* Artifacts as they arrive */}
        `      {/* {artifacts.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <FileText size={13} className="text-sky-400" />
                    <span>Generated Deliverables ({artifacts.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {artifacts.map((art, idx) => (
                      <ArtifactCard key={art.id || idx} artifact={art} />
                    ))}
                  </div>
                </div>
              )}` */}
            </div>
          </div>
        </div>
      )}

      <div ref={scrollBottomRef} />
    </div>
  );
};

export default ChatWindow;
