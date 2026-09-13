import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Layers,
  Database,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

export const KnowledgeBase = () => {
  const [sources, setSources] = useState([
    {
      id: 'kb-1',
      name: 'ASME Section VIII Pressure Vessel Guidelines',
      category: 'Engineering Standards',
      chunkCount: 1420,
      embeddingModel: 'bge-large-en-v1.5 (Local)',
      syncStatus: 'synced',
      lastSynced: '2026-08-30 14:00',
    },
    {
      id: 'kb-2',
      name: 'ISO 9001:2015 Inspection & Audit Protocols',
      category: 'Quality & Compliance',
      chunkCount: 860,
      embeddingModel: 'bge-large-en-v1.5 (Local)',
      syncStatus: 'synced',
      lastSynced: '2026-08-29 11:30',
    },
    {
      id: 'kb-3',
      name: 'Facility Turbomachinery Maintenance SOP v4.2',
      category: 'Internal SOP',
      chunkCount: 640,
      embeddingModel: 'bge-large-en-v1.5 (Local)',
      syncStatus: 'synced',
      lastSynced: '2026-08-31 08:00',
    },
    {
      id: 'kb-4',
      name: 'High-Pressure Cryogenic Valve Specifications',
      category: 'Technical Catalog',
      chunkCount: 310,
      embeddingModel: 'bge-large-en-v1.5 (Local)',
      syncStatus: 'indexing',
      lastSynced: 'Just now',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceCategory, setNewSourceCategory] = useState('Internal SOP');

  // Vector Query Playground State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleAddSource = (e) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;

    const newSource = {
      id: `kb-${Date.now()}`,
      name: newSourceName,
      category: newSourceCategory,
      chunkCount: Math.floor(Math.random() * 400) + 100,
      embeddingModel: 'bge-large-en-v1.5 (Local)',
      syncStatus: 'indexing',
      lastSynced: 'Just now',
    };

    setSources([newSource, ...sources]);
    setNewSourceName('');
    setIsAddModalOpen(false);
  };

  const handleTestSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setSearchResults([
        {
          source: 'ASME Section VIII Pressure Vessel Guidelines',
          clause: 'Clause UG-99 (Hydrostatic Testing)',
          score: 0.942,
          snippet: 'Hydrostatic test pressure shall not exceed 1.3 times the maximum allowable working pressure multiplied by the ratio of allowable stress.',
        },
        {
          source: 'Facility Turbomachinery Maintenance SOP v4.2',
          clause: 'Section 4.1.2 (Flange & Gasket Inspection)',
          score: 0.885,
          snippet: 'Inspect impeller perimeter for surface pitting and oxidation. If micro-corrosion exceeds 0.05mm, schedule seal re-greasing.',
        },
      ]);
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <BookOpen className="text-emerald-400" size={20} />
            <span>RAG Sovereign Knowledge Base & Vector Index</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Local vector embeddings for industrial standards, SOPs, and engineering manuals. Zero data egress.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-glow-emerald transition-all"
        >
          <Plus size={16} />
          <span>Add Knowledge Source</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0e121b] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Total Indexed Chunks</div>
          <div className="text-2xl font-bold text-slate-100 mt-1 font-mono">
            {sources.reduce((acc, s) => acc + s.chunkCount, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">100% Vectorized On-Premises</div>
        </div>

        <div className="bg-[#0e121b] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Embedding Engine</div>
          <div className="text-sm font-bold text-slate-200 mt-1 font-mono">bge-large-en-v1.5</div>
          <div className="text-[11px] text-sky-400 font-mono mt-1">Local GPU Inference (1024 Dim)</div>
        </div>

        <div className="bg-[#0e121b] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Vector Search Latency</div>
          <div className="text-2xl font-bold text-sky-400 mt-1 font-mono">14.2 ms</div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">HNSW Vector Graph</div>
        </div>
      </div>

      {/* Vector Query Playground */}
      <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-emerald-400" /> Vector Similarity Query Tester
        </h2>

        <form onSubmit={handleTestSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a test query (e.g. 'ASME hydrostatic test pressure limits')..."
            className="flex-1 bg-[#080a0f] border border-slate-700/60 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/40 font-sans"
          />
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Search size={14} />
            <span>Search Vectors</span>
          </button>
        </form>

        {/* Results */}
        {searchResults && (
          <div className="mt-4 space-y-2 pt-3 border-t border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">Top Semantic Matches:</div>
            {searchResults.map((res, idx) => (
              <div
                key={idx}
                className="bg-[#080a0f] border border-slate-800/80 rounded-lg p-3 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-semibold text-emerald-300">{res.source}</span>
                  <span className="bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                    Similarity: {(res.score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-slate-400 font-mono text-[10px]">{res.clause}</div>
                <div className="text-slate-300 font-serif italic text-xs pt-1">"{res.snippet}"</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sources List Table */}
      <div className="bg-[#0e121a] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-[#080a0f] border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300 font-semibold">Active Vector Knowledge Sources</span>
          <span className="text-xs font-mono text-slate-500">{sources.length} sources registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-medium">Source Name</th>
                <th className="py-3 px-3 font-medium">Category</th>
                <th className="py-3 px-3 font-medium">Vector Chunks</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium">Last Synced</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sources.map((s) => (
                <tr key={s.id} className="hover:bg-[#121722] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-[#090b10] border border-slate-800 text-emerald-400">
                        <Database size={15} />
                      </div>
                      <span className="font-medium text-slate-200 font-mono text-[12px]">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{s.category}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{s.chunkCount.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={s.syncStatus} size="xs" />
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{s.lastSynced}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSources(sources.filter((item) => item.id !== s.id))}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove source"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Source Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Local Knowledge Base Source"
      >
        <form onSubmit={handleAddSource} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-300 mb-1">Source Name / Manual Title</label>
            <input
              type="text"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              placeholder="e.g. ASME B31.3 Process Piping Standard"
              required
              className="w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Category</label>
            <select
              value={newSourceCategory}
              onChange={(e) => setNewSourceCategory(e.target.value)}
              className="w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="Engineering Standards">Engineering Standards</option>
              <option value="Internal SOP">Internal SOP</option>
              <option value="Quality & Compliance">Quality & Compliance</option>
              <option value="Technical Catalog">Technical Catalog</option>
            </select>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-emerald-300 text-[11px]">
            Chunking strategy: Recursive token split (512 tokens) with 10% overlap on local hardware.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              Add & Index
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default KnowledgeBase;
