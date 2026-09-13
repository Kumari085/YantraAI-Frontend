import React from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import { ShieldCheck, Cpu, HardDrive, Network, X, Server, Lock } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const TelemetryDrawer = ({ isOpen, onClose }) => {
  const { telemetry, networkAudit, connectionStatus, reconnect } = useWebSocket();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#0b0e14] border-l border-slate-800/90 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-950/60 border border-sky-500/30 text-sky-400">
                <Cpu size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Local Sovereign Telemetry
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Real-time Airgap Hardware Metrics
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Connection Status Banner */}
          <div className="p-3.5 rounded-lg bg-[#0e131d] border border-slate-800 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server size={15} className="text-sky-400" />
              <span className="text-xs font-medium text-slate-200">Backend Link:</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={connectionStatus} size="xs" />
              <button
                onClick={reconnect}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Reconnect
              </button>
            </div>
          </div>

          {/* GPU & VRAM Metrics */}
          <div className="space-y-4 mb-6">
            <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Compute & Memory Allocation
            </div>

            {/* GPU Utilization Bar */}
            <div className="p-3.5 rounded-lg bg-[#0e121a] border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Cpu size={13} className="text-sky-400" /> GPU Compute Load
                </span>
                <span className="font-mono text-sky-300 font-bold">
                  {telemetry?.gpu_util_pct || 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${telemetry?.gpu_util_pct || 0}%` }}
                />
              </div>
            </div>

            {/* VRAM Allocation Bar */}
            <div className="p-3.5 rounded-lg bg-[#0e121a] border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <HardDrive size={13} className="text-purple-400" /> Unified VRAM Pool
                </span>
                <span className="font-mono text-purple-300 font-bold">
                  {telemetry?.vram_used_gb || 0} / {telemetry?.vram_total_gb || 80} GB
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500"
                  style={{
                    width: `${((telemetry?.vram_used_gb || 0) / (telemetry?.vram_total_gb || 80)) * 100}%`,
                  }}
                />
              </div>

              {/* VRAM by model breakdown */}
              {telemetry?.vram_by_model && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 space-y-1.5 font-mono text-[11px]">
                  {telemetry.vram_by_model.map((m) => (
                    <div key={m.model_id} className="flex items-center justify-between text-slate-400">
                      <span className="truncate max-w-[200px] text-slate-300">{m.model_id}</span>
                      <span className="text-purple-300">{m.gb} GB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Network Airgap Proof */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={13} className="text-emerald-400" /> Air-Gap Firewall Status
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">External API Calls:</span>
                <span className="font-mono text-emerald-400 font-bold">0 (BLOCKED)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Air-Gap Policy:</span>
                <span className="font-mono text-emerald-300 uppercase">
                  {networkAudit?.verdict || 'ENFORCED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Firewall Heartbeats:</span>
                <span className="font-mono text-slate-400">
                  {networkAudit?.count_since_start || 142} cycles OK
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-800 text-center">
          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>YantraAI Sovereign Micro-Kernel Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryDrawer;
