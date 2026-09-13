import React from 'react';
import { Cpu, Zap, Eye, Code, FileText, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const ModelRouteBadge = ({ route }) => {
  if (!route) return null;

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'vision':
        return <Eye size={14} className="text-purple-400" />;
      case 'coding':
        return <Code size={14} className="text-cyan-400" />;
      case 'ocr':
        return <FileText size={14} className="text-amber-400" />;
      case 'reasoning':
      default:
        return <Cpu size={14} className="text-sky-400" />;
    }
  };

  return (
    <div className="bg-[#10141d]/90 border border-slate-800/80 rounded-lg p-3 my-2 text-xs transition-all duration-200 hover:border-slate-700/80">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-slate-800/80 border border-slate-700/60">
            {getCategoryIcon(route.category)}
          </div>
          <span className="font-mono font-medium text-slate-200">
            {route.model_id}
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {route.category || 'reasoning'}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          {route.vram_gb && (
            <span>
              VRAM: <strong className="text-slate-200">{route.vram_gb} GB</strong>
            </span>
          )}
          <StatusBadge status={route.load_status || 'loaded'} size="xs" />
        </div>
      </div>

      {route.reason && (
        <div className="text-slate-400 text-[11px] leading-relaxed flex items-start gap-1.5 mt-1 border-t border-slate-800/50 pt-1.5">
          <Zap size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-300">Routing Decision:</strong> {route.reason}
          </span>
        </div>
      )}
    </div>
  );
};

export default ModelRouteBadge;
