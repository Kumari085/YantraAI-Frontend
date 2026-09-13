import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronRight, Activity, Zap } from 'lucide-react';
import ModelRouteBadge from './ModelRouteBadge';
import AgentPlan from './AgentPlan';
import ToolActivityCard from './ToolActivityCard';
import LoadingSpinner from '../common/LoadingSpinner';

export const AgentActivity = ({
  modelRoute,
  plan = [],
  toolSteps = [],
  heartbeatText,
  isGenerating = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If there's no activity to show, return null
  const hasContent = Boolean(modelRoute || plan.length > 0 || toolSteps.length > 0 || heartbeatText);
  if (!hasContent) return null;

  return (
    <div className="my-3 rounded-lg border border-slate-800 bg-[#0c1018]/90 overflow-hidden shadow-lg transition-all">
      {/* Header bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#090c13] hover:bg-[#0f1420] transition-colors border-b border-slate-800/80"
      >
        <div className="flex items-center gap-2.5 font-mono text-xs">

          {isExpanded ? (
            <ChevronDown size={14} className="text-slate-400" />
          ) : (
            <ChevronRight size={14} className="text-slate-400" />
          )}
          <Activity size={14} className="text-sky-400" />
          <span className="font-semibold text-slate-200">Autonomous Agent Trace</span>
          {isGenerating && (
            <span className="flex items-center gap-1.5 text-[11px] text-sky-400 font-mono bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-500/30">
              <LoadingSpinner size="xs" />
              <span>{heartbeatText || 'Agent executing...'}</span>
            </span>
          )}
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          {toolSteps.length} tools • {plan.length} plan phases
        </div>
      </button>

      {/* Expandable Activity Details */}
      {isExpanded && (
        <div className="p-3.5 space-y-3 bg-[#0a0d14]/60">
          {/* Phased Agent Plan */}
          {plan.length > 0 && <AgentPlan steps={plan} isLive={isGenerating} />}
        </div>
      )}
    </div>
  );
};

export default AgentActivity;
