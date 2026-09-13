import React from 'react';
import { Shield, Eye, FileText, Code2, Database, Sparkles, Lock, ArrowUpRight } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const EmptyWelcomeState = () => {
  const { sendMessage } = useWorkspace();

  const suggestedTasks = [
    {
      title: 'Structural Safety & Wall Thickness Audit',
      prompt: 'Execute a structural integrity and wall thickness safety audit on ASME pressure guidelines with positive allowance calculations.',
      category: 'Reasoning & Sandbox',
      icon: <Code2 size={13} className="text-cyan-400" />,
    },
    {
      title: 'Equipment Optical & Defect Inspection',
      prompt: 'Analyze industrial pump image for surface oxidation, micro-pitting, and gasket tolerances.',
      category: 'Vision Model',
      icon: <Eye size={13} className="text-purple-400" />,
    },
    {
      title: 'Internal SOP & Policy Vector Retrieval',
      prompt: 'Search internal technical guidelines for ASME Section VIII Clause UG-99 hydrostatic testing requirements.',
      category: 'Local RAG',
      icon: <Database size={13} className="text-sky-400" />,
    },
    {
      title: 'Confidential Memo & Deliverable Generation',
      prompt: 'Synthesize compliance findings into a formal Word (.docx) inspection report draft requiring operator sign-off.',
      category: 'Artifact Gen',
      icon: <FileText size={13} className="text-emerald-400" />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none max-w-2xl mx-auto my-auto animate-in fade-in duration-300">
      {/* Sovereign Shield Icon */}
      <div className="relative mb-5 group">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#182030] to-[#0c1017] border border-sky-500/30 flex items-center justify-center shadow-glow-cyan">
          <Shield size={32} className="text-sky-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center">
          <Lock size={10} className="text-emerald-400" />
        </div>
      </div>

      {/* Brand Title */}
      <h1 className="text-2xl font-bold tracking-tight text-slate-100 mb-1 flex items-center gap-2">
        YantraAI
      </h1>

      {/* Tagline */}
      <p className="text-sm font-medium text-slate-400 mb-2">
        Sovereign Multimodal AI Workbench
      </p>

      {/* Airgap badge */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mb-8 bg-[#0d1018] px-3 py-1 rounded-full border border-slate-800">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Secure</span>
        <span>•</span>
        <span>Local</span>
        <span>•</span>
        <span>Offline</span>
      </div>

      {/* Prompt Starter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
        {suggestedTasks.map((task, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(task.prompt)}
            className="group p-3 rounded-lg bg-[#0e121b]/80 hover:bg-[#151c2a] border border-slate-800/80 hover:border-sky-500/30 transition-all text-xs flex flex-col justify-between gap-2 text-left"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                {task.icon}
                <span>{task.category}</span>
              </div>
              <ArrowUpRight
                size={13}
                className="text-slate-600 group-hover:text-sky-400 transition-colors"
              />
            </div>
            <div className="font-medium text-slate-300 group-hover:text-slate-100 text-[12px] leading-snug">
              {task.title}
            </div>
          </button>
        ))}
      </div>

   
    </div>
  );
};

export default EmptyWelcomeState;
