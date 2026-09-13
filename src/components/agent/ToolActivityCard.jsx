import React, { useState } from 'react';
import { Wrench, ChevronDown, ChevronRight, CheckCircle2, AlertCircle, Database, Search } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import SandboxOutput from './SandboxOutput';
import VisionActivityCard from '../vision/VisionActivityCard';
import OcrPreviewCard from '../ocr/OcrPreviewCard';

export const ToolActivityCard = ({ toolStep }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toolCall = toolStep?.tool_call;

  if (!toolCall) return null;

  // Render specialized UI if available
  if (toolCall.toolId === 'tool-vision' || toolCall.toolName === 'vision_analyzer') {
    return <VisionActivityCard toolCall={toolCall} />;
  }

  if (toolCall.toolId === 'tool-ocr' || toolCall.toolName === 'ocr_extractor') {
    return <OcrPreviewCard toolCall={toolCall} />;
  }

  if (toolCall.toolId === 'tool-code-execution' || toolCall.toolName === 'sandbox_python_executor') {
    return (
      <div className="my-2">
        <SandboxOutput
          stdout={toolCall.outputResult?.stdout}
          stderr={toolCall.outputResult?.stderr}
          exitCode={toolCall.outputResult?.exit_code}
          durationMs={toolCall.durationMs}
        />
      </div>
    );
  }

  // Generic Tool Card (e.g. RAG, File Ops)
  const isRunning = toolCall.status === 'running';

  return (
    <div className="bg-[#10141d] border border-slate-800/80 rounded-lg overflow-hidden my-2 text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 bg-[#0a0d13] hover:bg-[#121622] transition-colors border-b border-slate-800/60"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown size={13} className="text-slate-400" /> : <ChevronRight size={13} className="text-slate-400" />}
          {toolCall.toolId?.includes('rag') ? (
            <Database size={13} className="text-sky-400" />
          ) : (
            <Wrench size={13} className="text-amber-400" />
          )}
          <span className="font-mono text-slate-300 font-medium">
            {toolCall.toolName || toolCall.toolId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {toolCall.durationMs > 0 && (
            <span className="text-[11px] font-mono text-slate-500">{toolCall.durationMs}ms</span>
          )}
          <StatusBadge status={toolCall.status || 'completed'} size="xs" />
        </div>
      </button>

      {isOpen && (
        <div className="p-3 bg-[#0e121b]/80 space-y-2 font-mono text-[11px]">
          {toolCall.inputParams && (
            <div>
              <span className="text-slate-400 block mb-1">Parameters:</span>
              <pre className="bg-[#07090e] p-2 rounded border border-slate-800 text-sky-300/90 overflow-x-auto">
                {JSON.stringify(toolCall.inputParams, null, 2)}
              </pre>
            </div>
          )}

          {toolCall.outputResult && (
            <div>
              <span className="text-slate-400 block mb-1">Output Result:</span>
              <pre className="bg-[#07090e] p-2 rounded border border-slate-800 text-emerald-300/90 overflow-x-auto max-h-36">
                {JSON.stringify(toolCall.outputResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolActivityCard;
