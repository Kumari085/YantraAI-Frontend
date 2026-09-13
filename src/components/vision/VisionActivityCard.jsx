import React, { useState } from 'react';
import { Eye, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Tag, Shield } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const VisionActivityCard = ({ toolCall }) => {
  const [isOpen, setIsOpen] = useState(true);
  const result = toolCall?.outputResult;
  const isRunning = toolCall?.status === 'running';

  return (
    <div className="bg-[#10141d] border border-purple-500/20 rounded-lg overflow-hidden my-2 text-xs">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 bg-[#0c0f17] hover:bg-[#121622] transition-colors border-b border-purple-500/10"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown size={13} className="text-slate-400" /> : <ChevronRight size={13} className="text-slate-400" />}
          <Eye size={14} className="text-purple-400" />
          <span className="font-mono font-medium text-slate-200">Vision Analysis</span>
          <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
            Local Vision Model
          </span>
        </div>

        <div className="flex items-center gap-2">
          {toolCall?.durationMs > 0 && (
            <span className="text-[11px] font-mono text-slate-500">{toolCall.durationMs}ms</span>
          )}
          <StatusBadge status={toolCall?.status || 'completed'} size="xs" />
        </div>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="p-3 bg-[#0d1018]/80 space-y-2.5">
          {isRunning ? (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>Analyzing image features and visual defects on local VRAM...</span>
            </div>
          ) : result ? (
            <>
              {/* Detected Component */}
              {result.detectedComponent && (
                <div className="flex items-center justify-between bg-purple-950/20 border border-purple-500/20 rounded p-2">
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="text-purple-400" />
                    <span className="text-slate-300">Detected:</span>
                    <strong className="text-purple-200 font-semibold">{result.detectedComponent}</strong>
                  </div>
                  {result.confidence && (
                    <span className="text-[11px] font-mono text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              )}

              {/* Observations */}
              {result.observations && result.observations.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">
                    Visual Findings:
                  </span>
                  <div className="space-y-1">
                    {result.observations.map((obs, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 bg-[#090b10] border border-slate-800/80 rounded p-2 text-slate-300 text-[11px]"
                      >
                        {obs.toLowerCase().includes('corrosion') ||
                        obs.toLowerCase().includes('pitting') ||
                        obs.toLowerCase().includes('leakage') ||
                        obs.toLowerCase().includes('defect') ? (
                          <AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="leading-relaxed">{obs}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-slate-500 italic text-[11px]">Processing vision payload...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisionActivityCard;
