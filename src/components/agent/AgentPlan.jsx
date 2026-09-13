import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, ListOrdered, Shield } from 'lucide-react';
import PlanStep from './PlanStep';

export const AgentPlan = ({ steps = [], isLive = false }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!steps || steps.length === 0) return null;

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-[#10141d]/95 border border-slate-800/90 rounded-lg overflow-hidden my-2.5 text-xs transition-all">
      {isOpen && (
        <div className="px-4 py-3 bg-[#0e121b]/70 space-y-1">
          {steps.map((step, idx) => (
            <PlanStep
              key={step.id || idx}
              step={step}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentPlan;
