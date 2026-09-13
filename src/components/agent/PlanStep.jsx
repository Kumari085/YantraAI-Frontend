import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

export const PlanStep = ({ step, isLast }) => {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />;
      case 'running':
        return <LoadingSpinner size="xs" className="border-sky-400 flex-shrink-0" />;
      case 'failed':
        return <AlertCircle size={15} className="text-rose-400 flex-shrink-0" />;
      case 'pending':
      default:
        return <Circle size={14} className="text-slate-600 flex-shrink-0" />;
    }
  };

  const getPhaseColor = () => {
    switch (step.phase?.toLowerCase()) {
      case 'planning':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'evaluation':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'execution':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'synthesis':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-slate-400 bg-slate-800/40 border-slate-700/40';
    }
  };

  return (
    <div className="relative flex items-start gap-3 py-1.5 group">
      {/* Connecting vertical line */}
      {!isLast && (
        <div
          className={`absolute left-[7px] top-[24px] bottom-[-4px] w-[1px] ${
            step.status === 'completed' ? 'bg-emerald-500/30' : 'bg-slate-800'
          }`}
        />
      )}

      {/* Icon */}
      <div className="z-10 mt-0.5 bg-[#0e121b]">{getStatusIcon()}</div>

      {/* Step details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs ${
              step.status === 'completed'
                ? 'text-slate-300'
                : step.status === 'running'
                ? 'text-sky-300 font-medium'
                : 'text-slate-500'
            }`}
          >
            {step.title}
          </span>
          {step.phase && (
            <span
              className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border ${getPhaseColor()}`}
            >
              {step.phase}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanStep;
