import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const OcrPreviewCard = ({ toolCall }) => {
  const [isOpen, setIsOpen] = useState(false);
  const result = toolCall?.outputResult;
  const isRunning = toolCall?.status === 'running';

  return (
    <div className="bg-[#10141d] border border-amber-500/20 rounded-lg overflow-hidden my-2 text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 bg-[#0c0f17] hover:bg-[#121622] transition-colors border-b border-amber-500/10"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown size={13} className="text-slate-400" /> : <ChevronRight size={13} className="text-slate-400" />}
          <FileText size={14} className="text-amber-400" />
          <span className="font-mono font-medium text-slate-200">Local OCR Engine</span>
          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
            Document Extraction
          </span>
        </div>

        <div className="flex items-center gap-2">
          {toolCall?.durationMs > 0 && (
            <span className="text-[11px] font-mono text-slate-500">{toolCall.durationMs}ms</span>
          )}
          <StatusBadge status={toolCall?.status || 'completed'} size="xs" />
        </div>
      </button>

      {isOpen && (
        <div className="p-3 bg-[#0d1018]/80 space-y-2 font-mono text-[11px]">
          {isRunning ? (
            <div className="text-slate-400 py-1">Extracting tabular text & bounding vectors...</div>
          ) : result ? (
            <div className="bg-[#080a0f] p-2.5 rounded border border-slate-800 text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-xs">
                {result.extractedText || result.summary || JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-slate-500 italic">OCR extraction complete</div>
          )}
        </div>
      )}
    </div>
  );
};

export default OcrPreviewCard;
