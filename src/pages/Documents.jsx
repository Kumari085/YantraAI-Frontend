import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Image,
  FileSpreadsheet,
  UploadCloud,
  Search,
  Trash2,
  Eye,
  Sparkles,
  Database,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';

export const Documents = () => {
  const navigate = useNavigate();
  const { sendMessage } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);

  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      name: 'ASME_Section_VIII_Pressure_Guidelines.pdf',
      type: 'pdf',
      size: 4200000,
      classification: 'SOVEREIGN // RESTRICTED',
      uploadedAt: '2026-08-30 11:24',
      ocrStatus: 'completed',
      ragIndexed: true,
    },
    {
      id: 'doc-2',
      name: 'Turbine_Impeller_Optical_Scan_4K.jpg',
      type: 'image',
      size: 8100000,
      classification: 'CONFIDENTIAL',
      uploadedAt: '2026-08-31 09:12',
      ocrStatus: 'not_applicable',
      ragIndexed: false,
    },
    {
      id: 'doc-3',
      name: 'Facility_ISO9001_Maintenance_SOP.docx',
      type: 'docx',
      size: 1450000,
      classification: 'INTERNAL ONLY',
      uploadedAt: '2026-08-28 16:40',
      ocrStatus: 'completed',
      ragIndexed: true,
    },
    {
      id: 'doc-4',
      name: 'Hydrostatic_Stress_Allowances_2026.xlsx',
      type: 'xlsx',
      size: 680000,
      classification: 'RESTRICTED',
      uploadedAt: '2026-08-29 14:15',
      ocrStatus: 'completed',
      ragIndexed: true,
    },
  ]);

  const getDocIcon = (type) => {
    switch (type) {
      case 'image':
      case 'jpg':
      case 'png':
        return <Image size={16} className="text-purple-400" />;
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet size={16} className="text-emerald-400" />;
      default:
        return <FileText size={16} className="text-sky-400" />;
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.name.split('.').pop()?.toLowerCase() || 'file',
        size: file.size,
        classification: 'CONFIDENTIAL // LOCAL',
        uploadedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        ocrStatus: 'pending',
        ragIndexed: false,
      };
      setDocuments([newDoc, ...documents]);
    }
  };

  const handleDelete = (id) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  const handleAnalyzeWithAI = (doc) => {
    sendMessage(`Analyze sovereign document "${doc.name}" for structural anomalies and compliance constraints.`);
    navigate('/');
  };

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <Folder className="text-sky-400" size={20} />
            <span>Confidential Documents & Data Repository</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Air-gapped on-premises file storage with automated local OCR and Vision vector indexing.
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-glow-cyan transition-all">
          <UploadCloud size={16} />
          <span>Upload Confidential Document</span>
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.docx,.xlsx,.pptx,.txt,.csv,.png,.jpg,.jpeg"
          />
        </label>
      </div>

      {/* Search & Statistics Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0e121b] border border-slate-800 rounded-xl p-3.5">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name..."
            className="w-full bg-[#080a0f] border border-slate-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/40"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div>
            Total Files: <strong className="text-slate-200">{documents.length}</strong>
          </div>
          <div>•</div>
          <div>
            RAG Indexed: <strong className="text-emerald-400">{documents.filter(d => d.ragIndexed).length}</strong>
          </div>
          <div>•</div>
          <div className="text-sky-400">0 Cloud Leaks</div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-[#0e121a] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#080a0f] border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-medium">Document Name</th>
                <th className="py-3 px-3 font-medium">Classification</th>
                <th className="py-3 px-3 font-medium">Size</th>
                <th className="py-3 px-3 font-medium">OCR Status</th>
                <th className="py-3 px-3 font-medium">Vector Indexed</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#121722] transition-colors group">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded bg-[#090b10] border border-slate-800">
                        {getDocIcon(doc.type)}
                      </div>
                      <span className="font-medium text-slate-200 truncate max-w-xs font-mono text-[12px]">
                        {doc.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-500/30">
                      {doc.classification}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-400">{formatBytes(doc.size)}</td>

                  <td className="py-3 px-3">
                    <StatusBadge status={doc.ocrStatus} size="xs" />
                  </td>

                  <td className="py-3 px-3">
                    {doc.ragIndexed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                        <CheckCircle2 size={13} /> Indexed
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">Pending</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleAnalyzeWithAI(doc)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-medium transition-colors"
                        title="Analyze with Sovereign Agent"
                      >
                        <Sparkles size={12} />
                        <span>Analyze</span>
                      </button>

                      <button
                        onClick={() => setSelectedPreviewDoc(doc)}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        title="Preview Document"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      {selectedPreviewDoc && (
        <Modal
          isOpen={Boolean(selectedPreviewDoc)}
          onClose={() => setSelectedPreviewDoc(null)}
          title={`Document Preview: ${selectedPreviewDoc.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3 bg-[#080a0f] rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Classification:</span>
                <span className="text-sky-400">{selectedPreviewDoc.classification}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>File Size:</span>
                <span className="text-slate-200">{formatBytes(selectedPreviewDoc.size)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Storage Path:</span>
                <span className="text-slate-300">/var/aegis/vault/{selectedPreviewDoc.name}</span>
              </div>
            </div>

            <div className="p-4 bg-[#090b10] border border-slate-800 rounded-lg text-slate-300 leading-relaxed font-sans">
              <p className="font-semibold text-slate-200 mb-2">Parsed Document Header Content:</p>
              <p className="text-slate-400 text-xs">
                CONFIDENTIAL RECORD // AIRGAP ISOLATION VERIFIED.
                Contains structural calculation charts, wall thickness limits, and operational stress tolerances.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Documents;
