import React from 'react';
import clsx from 'clsx';

export const StatusBadge = ({ status, text, size = 'sm', pulse = false }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case 'running':
      case 'indexing':
      case 'loading':
      case 'active':
        return {
          dot: 'bg-sky-400',
          bg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
        };
      case 'completed':
      case 'success':
      case 'loaded':
      case 'approved':
        return {
          dot: 'bg-emerald-400',
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        };
      case 'failed':
      case 'error':
      case 'rejected':
        return {
          dot: 'bg-rose-400',
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        };
      case 'pending':
      case 'queued':
        return {
          dot: 'bg-amber-400',
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        };
      case 'offline':
      case 'idle':
      default:
        return {
          dot: 'bg-slate-400',
          bg: 'bg-slate-800/60 text-slate-400 border-slate-700/50',
        };
    }
  };

  const { dot, bg } = getStatusStyles();

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-mono border rounded-full font-medium',
        size === 'xs' && 'px-2 py-0.5 text-[10px]',
        size === 'sm' && 'px-2.5 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-xs',
        bg
      )}
    >
      <span
        className={clsx(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          dot,
          (pulse || status === 'running' || status === 'indexing') && 'animate-pulse'
        )}
      />
      <span>{text || status}</span>
    </span>
  );
};

export default StatusBadge;
