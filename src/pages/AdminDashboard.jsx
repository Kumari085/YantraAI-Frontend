import React from 'react';
import { Activity, Building2, Clock3, ShieldCheck, Users, Zap } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

const metrics = [
  { label: 'Total Users', value: '24', detail: '3 pending review', icon: Users, color: 'text-sky-400' },
  { label: 'Departments', value: '6', detail: 'All operational', icon: Building2, color: 'text-emerald-400' },
  { label: 'Active Sessions', value: '08', detail: '2 admin sessions', icon: Activity, color: 'text-purple-400' },
  { label: 'System Status', value: 'NOMINAL', detail: 'All local services ready', icon: ShieldCheck, color: 'text-emerald-400' },
];

const activity = [
  { action: 'User access updated', actor: 'Dr. Evelyn Vance', time: '4 minutes ago', status: 'completed' },
  { action: 'Department policy reviewed', actor: 'Marcus Chen', time: '18 minutes ago', status: 'completed' },
  { action: 'Maintenance notice published', actor: 'System Administrator', time: '1 hour ago', status: 'active' },
  { action: 'Session security check completed', actor: 'YantraAI Kernel', time: '2 hours ago', status: 'completed' },
];

export const AdminDashboard = () => (
  <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div>
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5"><ShieldCheck className="text-sky-400" size={20} /><span>Admin Portal</span></h1>
        <p className="text-xs text-slate-400 mt-1">Administrative overview for the local YantraAI workbench.</p>
      </div>
      <span className="text-[10px] font-mono text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-lg px-3 py-1.5">LOCAL MOCK DATA</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map(({ label, value, detail, icon: Icon, color }) => (
        <div key={label} className="bg-[#0e121a] border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between"><span className="text-xs font-mono text-slate-400">{label}</span><Icon size={16} className={color} /></div>
          <div className={`text-2xl font-bold font-mono mt-3 ${color}`}>{value}</div>
          <div className="text-[11px] text-slate-500 mt-1">{detail}</div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
      <section className="bg-[#0e121a] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between"><h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">Recent Administrative Activity</h2><Activity size={14} className="text-sky-400" /></div>
        <div className="divide-y divide-slate-800/70">{activity.map((item) => <div key={`${item.action}-${item.time}`} className="flex items-center justify-between gap-4 px-4 py-3"><div><div className="text-xs text-slate-200">{item.action}</div><div className="text-[10px] text-slate-500 font-mono mt-1">{item.actor} · {item.time}</div></div><StatusBadge status={item.status} size="xs" /></div>)}</div>
      </section>
      <section className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono"><Zap size={14} className="text-amber-400" />Operational Snapshot</div><div className="space-y-3 text-xs font-mono"><div className="flex justify-between text-slate-400"><span>Local API</span><span className="text-emerald-400">AVAILABLE</span></div><div className="flex justify-between text-slate-400"><span>RAG worker</span><span className="text-emerald-400">READY</span></div><div className="flex justify-between text-slate-400"><span>Model pool</span><span className="text-sky-400">4 REGISTERED</span></div><div className="flex justify-between text-slate-400"><span>Last review</span><span className="text-slate-200">Today, 10:30</span></div></div></section>
    </div>
  </div>
);

export default AdminDashboard;
