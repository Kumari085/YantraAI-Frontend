import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Folder, BookOpen, Cpu, Wrench, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { conversations, switchConversation } = useWorkspace();

  // Search items index
  const items = [
    // Conversations
    ...conversations.map((c) => ({
      id: c.id,
      title: c.title,
      type: 'Conversation',
      icon: <MessageSquare size={14} className="text-sky-400" />,
      action: () => {
        switchConversation(c.id);
        navigate('/');
        onClose();
      },
    })),
    // Pages / Sections
    {
      id: 'page-docs',
      title: 'Confidential Documents & Files',
      type: 'Repository',
      icon: <Folder size={14} className="text-blue-400" />,
      action: () => {
        navigate('/documents');
        onClose();
      },
    },
    {
      id: 'page-kb',
      title: 'Knowledge Base (RAG Vectors)',
      type: 'Knowledge Base',
      icon: <BookOpen size={14} className="text-emerald-400" />,
      action: () => {
        navigate('/knowledge-base');
        onClose();
      },
    },
    {
      id: 'page-models',
      title: 'Local Models (Qwen, InternVL, Nougat)',
      type: 'Models',
      icon: <Cpu size={14} className="text-purple-400" />,
      action: () => {
        navigate('/models');
        onClose();
      },
    },
    {
      id: 'page-tools',
      title: 'Sandbox Tool Registry',
      type: 'Tools',
      icon: <Wrench size={14} className="text-amber-400" />,
      action: () => {
        navigate('/tools');
        onClose();
      },
    },
    {
      id: 'page-audit',
      title: 'Immutable Audit Logs & Sovereignty Proofs',
      type: 'Audit',
      icon: <Search size={14} className="text-sky-400" />,
      action: () => {
        navigate('/audit-logs');
        onClose();
      },
    },
  ];

  const filteredItems = query.trim()
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Search Palette Container */}
      <div className="relative z-10 w-full max-w-xl bg-[#0e121a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#0a0d13]">
          <Search size={16} className="text-slate-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations, documents, tools, or knowledge..."
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results list */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No matching workbench entries found.
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#161c28] transition-colors text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 rounded-md bg-[#090b10] border border-slate-800">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-200 group-hover:text-sky-300 transition-colors truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">{item.type}</div>
                  </div>
                </div>

                <ArrowRight
                  size={14}
                  className="text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#080a0f] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Navigate with mouse or arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
