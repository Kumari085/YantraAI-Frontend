import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  ChevronDown,
  ChevronRight,
  Shield,
  FileText,
  Eye,
  Terminal,
  Database,
  ArrowRight,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';

export const Tasks = () => {
  const navigate = useNavigate();
  const { switchConversation } = useWorkspace();
  const [expandedTaskId, setExpandedTaskId] = useState('task-1042');

  const tasks = [
    {
      id: 'task-1042',
      title: 'ASME Section VIII Wall Thickness & Hydrostatic Safety Audit',
      status: 'completed',
      startTime: '2026-08-31 10:30:15',
      duration: '5.4s',
      modelRouted: 'Qwen 2.5 32B + DeepSeek Coder',
      artifactsGenerated: ['ASME_Inspection_Memo_Draft.docx'],
      timeline: [
        { time: '10:30:15', stage: 'Task Initiated by Operator', status: 'completed' },
        { time: '10:30:16', stage: 'Agent Phased Planning & Parameter Parsing', status: 'completed' },
        { time: '10:30:17', stage: 'RAG Search: ASME Section VIII Clause UG-99', status: 'completed' },
        { time: '10:30:18', stage: 'Python Sandbox: Positive Allowance Calculation (+0.2721 in)', status: 'completed' },
        { time: '10:30:19', stage: 'Artifact Compilation: ASME_Inspection_Memo_Draft.docx', status: 'completed' },
        { time: '10:30:20', stage: 'Task Completed // Airgap Verified', status: 'completed' },
      ],
    },
    {
      id: 'task-1041',
      title: 'Turbine Blade Optical Defect Scan & Micro-pitting Inspection',
      status: 'completed',
      startTime: '2026-08-31 09:12:04',
      duration: '4.8s',
      modelRouted: 'InternVL2 26B (Vision)',
      artifactsGenerated: ['Turbine_Defect_Log.xlsx'],
      timeline: [
        { time: '09:12:04', stage: 'Task Initiated with 4K Image Attachment', status: 'completed' },
        { time: '09:12:05', stage: 'Local Vision Preprocessing & Feature Extraction', status: 'completed' },
        { time: '09:12:07', stage: 'Surface Pitting & Flange Integrity Analysis', status: 'completed' },
        { time: '09:12:08', stage: 'Deliverable Generation & Grounding Complete', status: 'completed' },
      ],
    },
    {
      id: 'task-1040',
      title: 'Facility ISO 9001 Maintenance Protocol Indexing',
      status: 'completed',
      startTime: '2026-08-30 16:45:00',
      duration: '12.1s',
      modelRouted: 'Nougat OCR + Vector Indexer',
      artifactsGenerated: [],
      timeline: [
        { time: '16:45:00', stage: 'Document Ingestion: Facility_ISO9001_SOP.docx', status: 'completed' },
        { time: '16:45:06', stage: 'Neural OCR Tabular Markdown Extraction', status: 'completed' },
        { time: '16:45:12', stage: '860 Vector Chunks Indexed to Local HNSW', status: 'completed' },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <Zap className="text-sky-400" size={20} />
            <span>Autonomous Agent Task Monitor & Execution History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of autonomous multi-model agent loops and sandbox execution timelines.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 bg-[#0e121a] px-3 py-1.5 rounded-lg border border-slate-800">
          <div>
            Total Tasks: <strong className="text-slate-200">{tasks.length}</strong>
          </div>
          <div>•</div>
          <div>
            Success Rate: <strong className="text-emerald-400">100%</strong>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => {
          const isExpanded = expandedTaskId === task.id;
          return (
            <div
              key={task.id}
              className="bg-[#0e121a] border border-slate-800/90 rounded-xl overflow-hidden shadow-lg transition-all"
            >
              {/* Task Header Bar */}
              <button
                onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#090c13] hover:bg-[#121622] transition-colors text-left gap-3 border-b border-slate-800/60"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-semibold text-slate-100 text-sm truncate">
                        {task.title}
                      </span>
                      <span className="text-[10px] text-slate-500">({task.id})</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-1">
                      <span>Started: {task.startTime}</span>
                      <span>•</span>
                      <span>Duration: {task.duration}</span>
                      <span>•</span>
                      <span className="text-purple-400">{task.modelRouted}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <StatusBadge status={task.status} size="xs" />
                </div>
              </button>

              {/* Expanded Execution Timeline */}
              {isExpanded && (
                <div className="p-5 bg-[#0b0e14]/80 space-y-4">
                  <div className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                    <Clock size={13} className="text-sky-400" />
                    <span>Execution Stage Timeline</span>
                  </div>

                  <div className="relative pl-6 space-y-3 font-mono text-xs">
                    {/* Vertical line */}
                    <div className="absolute left-[9px] top-2 bottom-2 w-[1px] bg-emerald-500/40" />

                    {task.timeline.map((item, idx) => (
                      <div key={idx} className="relative flex items-center gap-3">
                        <div className="absolute -left-[20px] w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-[#0b0e14]" />
                        <span className="text-slate-500 text-[11px] w-16">{item.time}</span>
                        <span className="text-slate-200">{item.stage}</span>
                      </div>
                    ))}
                  </div>

                  {/* Artifacts if generated */}
                  {task.artifactsGenerated.length > 0 && (
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 text-slate-400">
                        <FileText size={13} className="text-emerald-400" />
                        <span>Artifact: {task.artifactsGenerated.join(', ')}</span>
                      </div>

                      <button
                        onClick={() => {
                          switchConversation('conv_sample_1');
                          navigate('/');
                        }}
                        className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        <span>Inspect in Workspace</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;
