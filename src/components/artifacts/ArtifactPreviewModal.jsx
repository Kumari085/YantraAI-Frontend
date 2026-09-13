import React from 'react';
import { Modal } from '../common/Modal';
import { ShieldCheck, Download, CheckCircle2, XCircle } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const ArtifactPreviewModal = ({ isOpen, onClose, artifact }) => {
  const { approveArtifact } = useWorkspace();

  if (!artifact) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Deliverable Preview:</span>
          <span className="font-mono text-sky-400">{artifact.title}</span>
        </div>
      }
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Security watermark bar */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs font-mono text-emerald-300">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-emerald-400" />
            <span>SOVEREIGN ARTIFACT GENERATED IN SANDBOX</span>
          </div>
          <span className="text-[10px] text-slate-400">HASH: SHA256: 7f89d4c19a0e</span>
        </div>

        {/* Formatted Content Preview */}
        <div className="p-5 bg-[#080a0f] border border-slate-800 rounded-lg text-slate-200 text-xs font-sans leading-relaxed space-y-3">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
              {artifact.title.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
            </h2>
            <div className="flex items-center gap-4 text-slate-400 text-[11px] mt-1 font-mono">
              <span>Classification: CONFIDENTIAL // SOVEREIGN AIRGAP</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-3 text-slate-300 text-xs">
            <p>
              <strong>1. Executive Summary:</strong> Autonomous inspection and computational verification performed on-premises. All physical parameters, wall thicknesses, and stress calculations comply with designated ISO/ASME Section VIII engineering standards.
            </p>

            <div className="p-3 bg-[#0d1017] rounded border border-slate-800/80 font-mono text-[11px]">
              <div className="text-sky-300 mb-1 font-semibold">--- TECHNICAL DATA TABLE ---</div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Allowable Stress (S): 18,000 PSI</div>
                <div>Design Pressure (P): 450 PSI</div>
                <div>Calculated Buffer: +0.2721 in</div>
                <div>Hydrostatic Status: PASSED</div>
              </div>
            </div>

            <p>
              <strong>2. Maintenance Recommendations:</strong> Flange perimeter exhibits slight micro-pitting. Schedule preventative seal re-greasing during standard Q3 downtime. No immediate operational risk observed.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
          <div className="text-[11px] text-slate-500 font-mono">
            {artifact.sizeBytes ? `${(artifact.sizeBytes / 1024).toFixed(1)} KB` : '160 KB'} • Local Artifact
          </div>

          <div className="flex items-center gap-2">
            {artifact.requiresApproval && (
              <>
                <button
                  onClick={() => {
                    approveArtifact(artifact.id, 'approve', 'Approved from Preview');
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium transition-colors"
                >
                  <CheckCircle2 size={13} />
                  Approve Deliverable
                </button>
                <button
                  onClick={() => {
                    approveArtifact(artifact.id, 'reject', 'Changes requested from Preview');
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-medium transition-colors"
                >
                  <XCircle size={13} />
                  Request Changes
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ArtifactPreviewModal;
