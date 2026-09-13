import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import ArtifactPreviewModal from './ArtifactPreviewModal';
import { useWorkspace } from '../../context/WorkspaceContext';

export const ArtifactCard = ({ artifact }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { approveArtifact } = useWorkspace();

  if (!artifact) return null;

  const getFileIcon = (type) => {
    const fileType = artifact.fileType || artifact.title?.split('.').pop()?.toLowerCase();
    switch (fileType) {
      case 'word':
      case 'docx':
      case 'doc':
        return <FileText size={18} className="text-blue-400" />;
      case 'excel':
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet size={18} className="text-emerald-400" />;
      case 'presentation':
      case 'pptx':
      case 'ppt':
        return <Presentation size={18} className="text-amber-400" />;
      default:
        return <FileText size={18} className="text-sky-400" />;
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '150 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleDownload = () => {
    // Generate synthetic or download real artifact
    const dummyContent = `=== AEGIS SOVEREIGN ARTIFACT: ${artifact.title} ===\nGenerated on Air-Gapped Local Cluster\nSecurity Verdict: PASS (Zero Cloud Egress)\nTimestamp: ${new Date().toISOString()}`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = artifact.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-[#0f131c] border border-slate-700/60 rounded-lg p-3 my-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md hover:border-slate-600 transition-colors">
        {/* Left file info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-[#090b10] border border-slate-800 flex-shrink-0">
            {getFileIcon(artifact.fileType)}
          </div>

          <div className="min-w-0">
            <div className="font-medium text-slate-100 truncate font-mono text-[12px]">
              {artifact.title}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{formatBytes(artifact.sizeBytes)}</span>
              <span>•</span>
              <span className="text-emerald-400/90 font-mono">Local Deliverable</span>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Approval pill */}
          {artifact.requiresApproval && (
            <div className="flex items-center gap-1">
              {artifact.approvalStatus === 'approve' ? (
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                  <CheckCircle2 size={11} /> Approved
                </span>
              ) : artifact.approvalStatus === 'reject' ? (
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-mono">
                  <XCircle size={11} /> Rejected
                </span>
              ) : (
                <div className="flex items-center gap-1 bg-[#090c12] p-0.5 rounded border border-slate-800">
                  <button
                    onClick={() => approveArtifact(artifact.id, 'approve', 'Approved by Operator')}
                    className="px-2 py-1 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => approveArtifact(artifact.id, 'reject', 'Rejection requested')}
                    className="px-2 py-1 rounded text-[10px] font-medium bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Preview button */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#161c28] hover:bg-[#202738] text-slate-200 border border-slate-700/60 transition-colors"
          >
            <Eye size={12} />
            <span>Preview</span>
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 transition-colors"
          >
            <Download size={12} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <ArtifactPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        artifact={artifact}
      />
    </>
  );
};

export default ArtifactCard;
