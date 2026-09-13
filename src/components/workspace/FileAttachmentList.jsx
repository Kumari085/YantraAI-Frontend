import React from 'react';
import { FileText, Image, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

export const FileAttachmentList = ({ attachments = [], onRemove }) => {
  if (!attachments || attachments.length === 0) return null;

  const getFileIcon = (file) => {
    const type = file.type?.toLowerCase() || '';
    const name = file.name?.toLowerCase() || '';

    if (type.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp)$/i.test(name)) {
      return <Image size={13} className="text-purple-400" />;
    }
    if (type.includes('spreadsheet') || /\.(xlsx|xls|csv)$/i.test(name)) {
      return <FileSpreadsheet size={13} className="text-emerald-400" />;
    }
    return <FileText size={13} className="text-sky-400" />;
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-2 px-1">
      {attachments.map((att) => (
        <div
          key={att.id}
          className="flex items-center gap-2 bg-[#121622] border border-slate-700/60 rounded-md px-2.5 py-1 text-xs text-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {getFileIcon(att)}
            <span className="truncate max-w-[140px] font-mono text-[11px] text-slate-200">
              {att.name}
            </span>
            {att.size && (
              <span className="text-[10px] text-slate-500 font-mono">
                ({formatSize(att.size)})
              </span>
            )}
          </div>

          {/* Status / Progress indicator */}
          {att.status === 'uploading' ? (
            <LoadingSpinner size="xs" />
          ) : (
            <span className="text-[9px] text-emerald-400 font-mono">LOCAL</span>
          )}

          {/* Remove button */}
          {onRemove && (
            <button
              onClick={() => onRemove(att.id)}
              className="text-slate-400 hover:text-rose-400 transition-colors p-0.5 rounded"
              title="Remove attachment"
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileAttachmentList;
