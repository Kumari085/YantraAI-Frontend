import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getNotices } from '../../services/notices.storage';

const priorityStyles = {
  high: 'text-rose-300 border-rose-500/30 bg-rose-950/30',
  normal: 'text-sky-300 border-sky-500/30 bg-sky-950/30',
  low: 'text-slate-300 border-slate-700 bg-slate-800/70',
};

const isRelevantToUser = (notice, user) => {
  if (!notice.target || notice.target === 'All Departments' || notice.target === 'All') return true;
  return user?.department?.toLowerCase() === notice.target.toLowerCase();
};

const getLatestNotice = (notices, user) => {
  const relevant = notices.filter((notice) => isRelevantToUser(notice, user));
  return [...relevant].sort((first, second) => {
    const firstTargeted = first.target && first.target !== 'All Departments' && first.target !== 'All';
    const secondTargeted = second.target && second.target !== 'All Departments' && second.target !== 'All';
    if (firstTargeted !== secondTargeted) return secondTargeted - firstTargeted;
    return new Date(second.date || 0) - new Date(first.date || 0);
  })[0] || null;
};

export const NoticeBanner = () => {
  const { user } = useAuth();
  const [notice, setNotice] = useState(null);
  const [dismissedId, setDismissedId] = useState(null);

  useEffect(() => {
    const refreshNotice = () => setNotice(getLatestNotice(getNotices(), user));
    refreshNotice();
    window.addEventListener('storage', refreshNotice);
    window.addEventListener('aegis-notices-updated', refreshNotice);
    return () => {
      window.removeEventListener('storage', refreshNotice);
      window.removeEventListener('aegis-notices-updated', refreshNotice);
    };
  }, [user]);

  if (user?.role === 'admin' || !notice || notice.id === dismissedId) return null;

  return (
    <section className="mx-5 mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 shadow-lg" aria-label="Workbench announcement">
      <div className="flex items-start gap-3">
        <Bell size={17} className="mt-0.5 flex-shrink-0 text-amber-400" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xs font-semibold text-amber-100">{notice.title}</h2>
            <span className={`rounded border px-1.5 py-0.5 text-[9px] font-mono uppercase ${priorityStyles[notice.priority] || priorityStyles.normal}`}>
              {notice.priority || 'normal'}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{notice.message}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-mono text-slate-500">
            <span>Date: <strong className="text-slate-300">{notice.date || 'Unscheduled'}</strong></span>
            {notice.target && notice.target !== 'All Departments' && notice.target !== 'All' && (
              <span>Target: <strong className="text-slate-300">{notice.target}</strong></span>
            )}
          </div>
        </div>
        <button type="button" onClick={() => setDismissedId(notice.id)} className="rounded-md p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-200" title="Dismiss announcement" aria-label="Dismiss announcement">
          <X size={14} />
        </button>
      </div>
    </section>
  );
};

export default NoticeBanner;
