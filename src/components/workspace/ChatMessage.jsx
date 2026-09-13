import React, { useState } from 'react';
import { Shield, User, Copy, Check, Sparkles, Terminal, FileText } from 'lucide-react';
import AgentActivity from '../agent/AgentActivity';
import CitationList from '../citations/CitationList';
import ArtifactCard from '../artifacts/ArtifactCard';
import FileAttachmentList from './FileAttachmentList';

export const ChatMessage = ({ message, isStreaming = false }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render basic markdown formatting: bold, numbered items, code blocks
  const renderFormattedContent = (content) => {
    if (!content) return null;

    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0]?.match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const code = language ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div
            key={index}
            className="my-3 rounded-lg overflow-hidden border border-slate-800 bg-[#07090e] font-mono text-xs"
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d1017] border-b border-slate-800 text-slate-400 text-[11px]">
              <span>{language || 'code'}</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="hover:text-slate-200 transition-colors"
                title="Copy code"
              >
                <Copy size={12} />
              </button>
            </div>
            <pre className="p-3 text-sky-200/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {code}
            </pre>
          </div>
        );
      }

      // Format bold markdown (**text**) and paragraph line breaks
      const paragraphs = part.split('\n\n');
      return (
        <div key={index} className="space-y-2">
          {paragraphs.map((p, pIdx) => {
            if (!p.trim()) return null;
            // Replace bold syntax
            const formattedParagraph = p.split(/(\*\*.*?\*\*)/g).map((chunk, cIdx) => {
              if (chunk.startsWith('**') && chunk.endsWith('**')) {
                return (
                  <strong key={cIdx} className="font-semibold text-slate-100">
                    {chunk.slice(2, -2)}
                  </strong>
                );
              }
              return chunk;
            });

            return (
              <p key={pIdx} className="leading-relaxed text-slate-300">
                {formattedParagraph}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div
      className={`py-4 px-4 sm:px-6 transition-colors ${
        isUser ? 'bg-transparent' : 'bg-[#0a0d14]/40 border-y border-slate-900/60'
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-start gap-3.5">
        {/* Avatar Icon */}
        <div className="flex-shrink-0 mt-0.5">
      
          {isUser ? (
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User size={14} />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-sky-950 to-[#0c1018] border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm">
              <Shield size={15} />
            </div>
          )}
        </div>

        {/* Message Body */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">
                {isUser ? 'Operator' : 'YantraAI'}
              </span>
              {!isUser && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Airgap Sovereign
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Turn execution stats */}
              {/* {message.stats && (
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span>{message.stats.tokens_per_sec} t/s</span>
                  <span>•</span>
                  <span>{message.stats.tokens_used} tokens</span>
                  <span>•</span>
                  <span>{(message.stats.total_duration_ms / 1000).toFixed(1)}s</span>
                </div>
              )} */}

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                title="Copy message"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
          
            </div>
          </div>

          {/* User Attachments */}
          {isUser && message.attachments && message.attachments.length > 0 && (
            <div className="my-2">
              <FileAttachmentList attachments={message.attachments} />
            </div>
          )}

          {/* Agent Activity Trace (Model route, Plan, Tools) */}
          {!isUser && (message.modelRoute || (message.plan && message.plan.length > 0) || (message.toolSteps && message.toolSteps.length > 0)) && (
            <AgentActivity
              plan={message.plan}
              isGenerating={false}
            />
          )}

          {/* Text message content */}
          <div className="text-sm font-sans text-slate-200 leading-relaxed break-words">
            {renderFormattedContent(message.content)}
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-sky-400 animate-cursor-blink align-middle" />
            )}
          </div>

          {/* Grounded Citations */}
          {/* {!isUser && message.citations && message.citations.length > 0 && (
            <CitationList citations={message.citations} />
          )} */}

          {/* Deliverable Artifacts */}
          {!isUser && message.artifacts && message.artifacts.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <FileText size={13} className="text-sky-400" />
                <span>Generated Workbench Deliverables ({message.artifacts.length})</span>
              </div>
              <div className="space-y-1.5">
                {message.artifacts.map((art, idx) => (
                  <ArtifactCard
                    key={art.id || idx}
                    artifact={typeof art === 'string' ? { id: art, title: art } : art}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
