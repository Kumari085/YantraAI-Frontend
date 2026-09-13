import React from 'react';
import { Shield, Cpu, User, LogOut } from 'lucide-react';
import { useWebSocket } from '../../context/WebSocketContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ onOpenTelemetry }) => {
  const { telemetry } = useWebSocket();
  const { currentSessionId, conversations } = useWorkspace();
  const { user, logout } = useAuth();

  const currentConv = conversations.find((c) => c.id === currentSessionId);

  return (
    <header className="h-12 bg-[#090b10] border-b border-slate-800/80 px-4 flex items-center justify-between select-none z-20">
      {/* Left: Active project / task title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono truncate">
          <Shield size={14} className="text-sky-400 flex-shrink-0" />
          <span className="text-slate-300 font-medium">YantraAI</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 truncate max-w-[220px] sm:max-w-sm">
            {currentConv?.title || 'Sovereign Multimodal Workspace'}
          </span>
        </div>
      </div>

      {/* Right: Airgap status pills, GPU glance & User Session */}
      <div className="flex items-center gap-2.5 font-mono text-[11px]">
        {/* Airgap status flags */}
        {/* <div className="hidden lg:flex items-center gap-2 bg-[#0e121a] px-2.5 py-1 rounded-full border border-slate-800">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LOCAL
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-sky-400">SECURE</span>
          <span className="text-slate-600">•</span>
          <span className="text-purple-400">AIR-GAPPED</span>
        </div> */}

        {/* GPU & Telemetry Button */}
        {/* <button
          onClick={onOpenTelemetry}
          className="flex items-center gap-2 bg-[#0e121a] hover:bg-[#141924] text-slate-300 hover:text-slate-100 px-2.5 py-1 rounded-md border border-slate-800 transition-colors"
          title="Open Sovereign Telemetry"
        >
          <Cpu size={13} className="text-sky-400" />
          <span className="hidden sm:inline">GPU:</span>
          <span className="text-sky-300 font-bold">{telemetry?.gpu_util_pct || 0}%</span>
          <span className="text-slate-600">•</span>
          <span className="text-purple-300">{telemetry?.vram_used_gb || 0}GB</span>
        </button> */}

        {/* User Identity Chip & Logout */}
        {user && (
          <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
            <div className="hidden sm:flex items-center gap-1.5 bg-[#0e121a] px-2.5 py-1 rounded-md border border-slate-800">
              <User size={12} className={user.role === 'admin' ? 'text-sky-400' : 'text-emerald-400'} />
              <span className="text-slate-200 font-sans text-xs font-medium truncate max-w-[120px]">
                {user.name?.split(' ')[0] || user.email}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold uppercase ${
                  user.role === 'admin'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {user.role}
              </span>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-md bg-[#0e121a] hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 transition-colors"
              title={`Sign Out (${user.email})`}
            >
              <LogOut size={13} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
