import React, { useEffect, useState } from 'react';
import { Bell, CalendarDays, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotices } from '../services/notices.storage';

const priorityStyles = {
  high: 'text-rose-300 bg-rose-950/30 border-rose-500/30',
  normal: 'text-sky-300 bg-sky-950/30 border-sky-500/30',
  low: 'text-slate-300 bg-slate-800 border-slate-700',
};

const isRelevantNotice = (notice, user) => {
  if (!notice.target || notice.target === 'All Departments' || notice.target === 'All') return true;
  return user?.department?.toLowerCase() === notice.target.toLowerCase();
};

const sortNotices = (notices, user) => [...notices].sort((first, second) => {
  const firstTargeted = first.target && first.target !== 'All Departments' && first.target !== 'All' && first.target.toLowerCase() === user?.department?.toLowerCase();
  const secondTargeted = second.target && second.target !== 'All Departments' && second.target !== 'All' && second.target.toLowerCase() === user?.department?.toLowerCase();
  if (firstTargeted !== secondTargeted) return secondTargeted - firstTargeted;
  return new Date(second.date || 0) - new Date(first.date || 0);
});

export const UserNotices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const refreshNotices = () => {
      setNotices(sortNotices(getNotices().filter((notice) => isRelevantNotice(notice, user)), user));
    };

    refreshNotices();
    window.addEventListener('storage', refreshNotices);
    window.addEventListener('aegis-notices-updated', refreshNotices);
    return () => {
      window.removeEventListener('storage', refreshNotices);
      window.removeEventListener('aegis-notices-updated', refreshNotices);
    };
  }, [user]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <Bell className="text-amber-400" size={20} />
            <span>Notices</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Read-only announcements issued by YantraAI administrators.</p>
        </div>
        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-lg px-3 py-1.5">ADMIN PUBLISHED · LOCAL DEMO</span>
      </div>

      {notices.length === 0 ? (
        <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-10 text-center shadow-lg">
          <Bell size={24} className="mx-auto text-slate-600" />
          <p className="mt-3 text-sm text-slate-300">No notices for your department.</p>
          <p className="mt-1 text-xs text-slate-500">Administrator announcements will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice, index) => {
            const isNew = notice.date && notice.date >= today;
            const isImportant = notice.priority === 'high';
            return (
              <article key={notice.id} className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold text-slate-100">{notice.title}</h2>
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-mono uppercase ${priorityStyles[notice.priority] || priorityStyles.normal}`}>
                        {notice.priority || 'normal'}
                      </span>
                      {isNew && <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 text-[10px] font-mono uppercase">New</span>}
                      {isImportant && <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-rose-300"><ShieldAlert size={12} />Important</span>}
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{notice.message}</p>
                    <div className="flex flex-wrap gap-4 mt-4 text-[10px] font-mono text-slate-500">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays size={12} />Issued: <strong className="text-slate-300">{notice.date || 'Unscheduled'}</strong></span>
                      <span>Target: <strong className="text-slate-300">{notice.target || 'All Departments'}</strong></span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">{index + 1} / {notices.length}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserNotices;
