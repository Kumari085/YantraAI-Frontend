import React, { useState } from 'react';
import { Terminal, Copy, Check, ShieldCheck } from 'lucide-react';

export const SandboxOutput = ({ stdout, stderr, exitCode, durationMs }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(stdout || stderr || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#07090d] border border-slate-800/90 rounded-md overflow-hidden font-mono text-[11px] my-2">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0b0e14] border-b border-slate-800/80 text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-emerald-400" />
          <span className="text-slate-300 font-medium">Python Sandbox stdout</span>
          {exitCode !== undefined && (
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded ${
                exitCode === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              exit: {exitCode}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] text-emerald-400/90">
            <ShieldCheck size={12} />
            <span>AIRGAP ISOLATED</span>
          </div>
          {durationMs && <span>{durationMs}ms</span>}
          <button
            onClick={handleCopy}
            className="p-1 hover:text-slate-200 transition-colors"
            title="Copy Output"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* Output Content */}
      <div className="p-3 overflow-x-auto max-h-48 leading-relaxed">
        {stdout && <pre className="text-emerald-300/90 whitespace-pre-wrap">{stdout}</pre>}
        {stderr && <pre className="text-rose-400 whitespace-pre-wrap mt-1">{stderr}</pre>}
        {!stdout && !stderr && <span className="text-slate-600 italic">No output received</span>}
      </div>
    </div>
  );
};

export default SandboxOutput;
