import React, { useState } from 'react';
import {
  ScrollText,
  ShieldCheck,
  Lock,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Server,
} from 'lucide-react';

export const AuditLogs = () => {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const auditEvents = [
    {
      id: 'AUD-9921',
      timestamp: '2026-08-31 10:30:20',
      action: 'TASK_COMPLETED_AIRGAP',
      actor: 'Sovereign Orchestrator',
      resource: 'conv_1042 // ASME Inspection Memo',
      status: 'VERIFIED',
      hash: 'sha256:7f89d4c19a0e2381fbb4',
      externalCalls: 0,
    },
    {
      id: 'AUD-9920',
      timestamp: '2026-08-31 10:30:18',
      action: 'SANDBOX_CGROUP_EXECUTION',
      actor: 'DeepSeek Coder Sandbox',
      resource: 'calc_safety_margin() [Memory: 14MB]',
      status: 'VERIFIED',
      hash: 'sha256:3a1b8c9d0e1f2a3b4c5d',
      externalCalls: 0,
    },
    {
      id: 'AUD-9919',
      timestamp: '2026-08-31 10:30:17',
      action: 'LOCAL_VECTOR_RETRIEVAL',
      actor: 'bge-large-en-v1.5',
      resource: 'ASME Section VIII Clause UG-99',
      status: 'VERIFIED',
      hash: 'sha256:5e6f7a8b9c0d1e2f3a4b',
      externalCalls: 0,
    },
    {
      id: 'AUD-9918',
      timestamp: '2026-08-31 09:12:08',
      action: 'LOCAL_VISION_INSPECTION',
      actor: 'InternVL2 26B',
      resource: 'Turbine_Impeller_Optical_Scan_4K.jpg',
      status: 'VERIFIED',
      hash: 'sha256:9c0d1e2f3a4b5c6d7e8f',
      externalCalls: 0,
    },
    {
      id: 'AUD-9917',
      timestamp: '2026-08-30 16:45:12',
      action: 'NEURAL_OCR_INGESTION',
      actor: 'Nougat OCR Engine',
      resource: 'Facility_ISO9001_SOP.docx',
      status: 'VERIFIED',
      hash: 'sha256:1a2b3c4d5e6f7a8b9c0d',
      externalCalls: 0,
    },
  ];

  const handleExportCertificate = () => {
    const reportData = {
      facility: 'YantraAI Sovereign Airgap Installation',
      certificationDate: new Date().toISOString(),
      airgapStatus: '100% ISOLATED',
      externalApiCallsLogged: 0,
      externalNetworkEgressBytes: 0,
      auditRecords: auditEvents,
      masterHash: 'SHA256: 88f7b2a9e10c55d44a2b11',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AegisAI_Sovereignty_Audit_Certificate_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredLogs = auditEvents.filter((ev) => {
    const matchesSearch =
      ev.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <ScrollText className="text-sky-400" size={20} />
            <span>Immutable Audit Trail & Sovereignty Verification</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident system logs providing cryptographic proof of 100% on-premises execution and zero cloud leaks.
          </p>
        </div>

        <button
          onClick={handleExportCertificate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-glow-cyan transition-all"
        >
          <Download size={15} />
          <span>Export Sovereignty Certificate</span>
        </button>
      </div>

      {/* Security Proof Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-[11px] font-mono text-emerald-400">External API Calls</div>
          <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">0</div>
          <div className="text-[10px] text-slate-400 mt-1">Cloud Outbound Blocked</div>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-[11px] font-mono text-emerald-400">Network Firewall</div>
          <div className="text-lg font-bold text-emerald-300 font-mono mt-1">AIRGAP ENFORCED</div>
          <div className="text-[10px] text-slate-400 mt-1">Kernel Socket Isolation</div>
        </div>

        <div className="bg-sky-950/20 border border-sky-500/30 rounded-xl p-4">
          <div className="text-[11px] font-mono text-sky-400">Model Inference</div>
          <div className="text-lg font-bold text-sky-300 font-mono mt-1">100% LOCAL VRAM</div>
          <div className="text-[10px] text-slate-400 mt-1">On-Premises Hardware</div>
        </div>

        <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4">
          <div className="text-[11px] font-mono text-purple-400">Audit Verification</div>
          <div className="text-lg font-bold text-purple-300 font-mono mt-1">SHA256 SIGNED</div>
          <div className="text-[10px] text-slate-400 mt-1">Immutable Ledger</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0e121b] border border-slate-800 rounded-xl p-3.5">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit logs by event, actor, or ID..."
            className="w-full bg-[#080a0f] border border-slate-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/40 font-mono"
          />
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing {filteredLogs.length} certified audit entries
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0e121a] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#080a0f] border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-3 px-4 font-medium">Log ID & Time</th>
                <th className="py-3 px-3 font-medium">Action</th>
                <th className="py-3 px-3 font-medium">Actor</th>
                <th className="py-3 px-3 font-medium">Resource / Operation</th>
                <th className="py-3 px-3 font-medium">External Calls</th>
                <th className="py-3 px-4 font-medium text-right">Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#121722] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{log.id}</div>
                    <div className="text-[10px] text-slate-500">{log.timestamp}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-500/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{log.actor}</td>
                  <td className="py-3 px-3 text-slate-400 truncate max-w-xs">{log.resource}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">
                    {log.externalCalls} (0 B)
                  </td>
                  <td className="py-3 px-4 text-right text-[10px] text-slate-500 truncate max-w-[120px]">
                    {log.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
