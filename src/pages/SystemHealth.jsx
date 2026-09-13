import React from 'react';
import { CheckCircle2, Cpu, Database, HardDrive, HeartPulse, Radio, Server, Wifi } from 'lucide-react';

const checks = [
  { label: 'Backend / API', detail: 'FastAPI health endpoint', status: 'Operational', icon: Server, color: 'text-emerald-400' },
  { label: 'RAG Worker', detail: 'Retrieval and vector services', status: 'Operational', icon: Database, color: 'text-emerald-400' },
  { label: 'Model Pool', detail: 'Local inference registry', status: 'Operational', icon: Cpu, color: 'text-sky-400' },
  { label: 'GPU / VRAM', detail: '80.0 GB pool · 38.0 GB allocated', status: 'Healthy', icon: Cpu, color: 'text-purple-400' },
  { label: 'Storage', detail: 'Local document vault', status: 'Healthy', icon: HardDrive, color: 'text-emerald-400' },
  { label: 'Network Isolation', detail: 'Air-gap policy monitor', status: 'Enforced', icon: Wifi, color: 'text-amber-400' },
];

export const SystemHealth = () => (
  <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4"><div><h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5"><HeartPulse className="text-rose-400" size={20} /><span>System Health</span></h1><p className="text-xs text-slate-400 mt-1">Local infrastructure status for the sovereign workbench.</p></div><span className="text-[10px] font-mono text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-lg px-3 py-1.5">LOCAL MOCK DATA · LAST CHECKED 10:42:18</span></div>
    <section className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 shadow-lg"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"><CheckCircle2 className="text-emerald-400" size={22} /></div><div><div className="text-sm font-semibold text-emerald-300">Overall System Status: NOMINAL</div><div className="text-xs text-slate-400 mt-1">All monitored local services are reporting healthy status.</div></div></div><div className="flex items-center gap-2 text-[11px] font-mono text-emerald-300"><Radio size={13} className="animate-pulse" />MONITORING ACTIVE</div></div></section>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{checks.map(({ label, detail, status, icon: Icon, color }) => <div key={label} className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 shadow-lg"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><Icon size={18} className={color} /><div><h2 className="text-sm font-semibold text-slate-200">{label}</h2><p className="text-[11px] text-slate-500 mt-1">{detail}</p></div></div><span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{status}</span></div></div>)}</div>
  </div>
);

export default SystemHealth;
