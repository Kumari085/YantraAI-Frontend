import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Eye,
  Code2,
  FileText,
  HardDrive,
  Zap,
  Play,
  Power,
  AlertTriangle,
  RefreshCw,
  Server,
  Plus,
  Trash2,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';
import modelsApi from '../services/models.api';

export const Models = () => {
  const { telemetry } = useWebSocket();
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin');

  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromBackend, setIsFromBackend] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [benchmarkingModelId, setBenchmarkingModelId] = useState(null);
  const [vramWarning, setVramWarning] = useState(null);

  // Add Model Modal State (Admin)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newModelForm, setNewModelForm] = useState({
    name: '',
    category: 'reasoning',
    params: '8.0 Billion',
    quantization: 'GGUF Q4_K_M',
    contextWindow: '32,000 Tokens',
    vramGB: 6.0,
    latencyTokensPerSec: 65.0,
    description: '',
  });

  // Total system VRAM from hardware telemetry (defaults to 80.0 GB if unconfigured)
  const totalSystemVram = telemetry?.vram_total_gb || 80.0;

  const fetchModels = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await modelsApi.getModels();
      setModels(res.models || []);
      setIsFromBackend(Boolean(res.isFromBackend));
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch models from backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // Compute allocated VRAM from loaded models
  const calculatedAllocatedVram = models
    .filter((m) => m.status === 'loaded')
    .reduce((acc, m) => acc + (m.vramGB || 0), 0);

  // Ensure allocated VRAM never exceeds total VRAM
  const allocatedVram = Math.min(
    telemetry?.vram_used_gb !== undefined && isFromBackend
      ? telemetry.vram_used_gb
      : calculatedAllocatedVram,
    totalSystemVram
  );

  const availableVram = Math.max(0, totalSystemVram - allocatedVram);
  const vramUsagePct = Math.min(100, Math.round((allocatedVram / totalSystemVram) * 100));

  const getModelIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'vision':
        return <Eye size={18} className="text-purple-400" />;
      case 'coding':
        return <Code2 size={18} className="text-cyan-400" />;
      case 'ocr':
        return <FileText size={18} className="text-amber-400" />;
      case 'reasoning':
      default:
        return <Cpu size={18} className="text-sky-400" />;
    }
  };

  const toggleLoad = async (model) => {
    setVramWarning(null);

    if (model.status === 'loaded') {
      // Unload model
      try {
        await modelsApi.unloadModel(model.id);
        setModels((prev) =>
          prev.map((m) => (m.id === model.id ? { ...m, status: 'standby' } : m))
        );
      } catch (err) {
        console.error('Failed to unload model:', err);
      }
    } else {
      // Check VRAM headroom before loading
      const projectedVram = allocatedVram + (model.vramGB || 0);
      if (projectedVram > totalSystemVram) {
        setVramWarning(
          `Insufficient VRAM headroom: Loading "${model.name}" requires ${model.vramGB} GB, but only ${availableVram.toFixed(
            1
          )} GB is available out of ${totalSystemVram} GB. Please unload another model first.`
        );
        return;
      }

      // Load model
      try {
        await modelsApi.loadModel(model.id);
        setModels((prev) =>
          prev.map((m) => (m.id === model.id ? { ...m, status: 'loaded' } : m))
        );
      } catch (err) {
        console.error('Failed to load model:', err);
      }
    }
  };

  const runBenchmark = (modelId) => {
    setBenchmarkingModelId(modelId);
    setTimeout(() => {
      setBenchmarkingModelId(null);
    }, 1200);
  };

  const handleRegisterModel = async (e) => {
    e.preventDefault();
    if (!newModelForm.name.trim()) return;

    try {
      const created = await modelsApi.registerModel({
        ...newModelForm,
        vramGB: parseFloat(newModelForm.vramGB) || 4.0,
        latencyTokensPerSec: parseFloat(newModelForm.latencyTokensPerSec) || 50.0,
      });

      setModels((prev) => [...prev, created]);
      setIsAddModalOpen(false);
      setNewModelForm({
        name: '',
        category: 'reasoning',
        params: '8.0 Billion',
        quantization: 'GGUF Q4_K_M',
        contextWindow: '32,000 Tokens',
        vramGB: 6.0,
        latencyTokensPerSec: 65.0,
        description: '',
      });
    } catch (err) {
      console.error('Failed to register model:', err);
      alert('Error registering model: ' + err.message);
    }
  };

  const handleDeleteModel = async (modelId) => {
    if (!window.confirm('Confirm deletion of this local model definition?')) return;
    try {
      await modelsApi.deleteModel(modelId);
      setModels((prev) => prev.filter((m) => m.id !== modelId));
    } catch (err) {
      console.error('Failed to delete model:', err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Header & Connection Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <Cpu className="text-sky-400" size={20} />
            <span>Local Model Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero cloud AI endpoints. All models execute locally via on-premises GPU cluster.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Data Source Badge */}
          

          {/* Admin Add Model Action */}
          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-glow-cyan transition-all font-mono"
            >
              <Plus size={14} />
              <span>Register Model</span>
            </button>
          )}

          <button
            onClick={fetchModels}
            disabled={isLoading}
            className="p-2 rounded-lg bg-[#0e121a] hover:bg-[#141924] text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            title="Refresh models from backend"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-sky-400' : ''} />
          </button>
        </div>
      </div>

 

      {/* Model List */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
          <LoadingSpinner size="lg" />
          <span className="text-xs font-mono">Querying Local Model Catalog...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {models.map((model) => {
            const isLoaded = model.status === 'loaded';
            return (
              <div
                key={model.id}
                className={`bg-[#0e121a] border rounded-xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center gap-4 transition-all ${
                  isLoaded
                    ? 'border-slate-700/90 shadow-md'
                    : 'border-slate-800/60 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Icon */}
                <div className="p-2 rounded-lg bg-[#080a0f] border border-slate-800 flex-shrink-0 self-start sm:self-center">
                  {getModelIcon("reasoning")}
                </div>

                {/* Name, category, description */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-semibold text-slate-100 text-sm font-mono truncate">
                      {model.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {model.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1 truncate sm:whitespace-normal">
                    {model.description}
                  </p>
                </div>

                {/* Technical Spec Strip */}
                <div className="flex items-center gap-4 bg-[#080a0f] px-3 py-2 rounded-lg border border-slate-800/80 font-mono text-[11px] flex-shrink-0 overflow-x-auto">
                  <span className="text-slate-200 whitespace-nowrap">{model.params}</span>
                  <span className="text-slate-700">|</span>
                  <span className="text-slate-200 whitespace-nowrap">{model.contextWindow}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteModel(model.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
                      title="Delete model definition"
                      type="button"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Register Local Model Modal (Admin) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Sovereign Local Model"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleRegisterModel} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Model Name / Identifier</label>
            <input
              type="text"
              value={newModelForm.name}
              onChange={(e) => setNewModelForm({ ...newModelForm, name: e.target.value })}
              placeholder="e.g. Qwen 3 8B Instruct"
              required
              className="w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Category</label>
              <select
                value={newModelForm.category}
                onChange={(e) => setNewModelForm({ ...newModelForm, category: e.target.value })}
                className="w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="reasoning">Reasoning</option>
                <option value="vision">Vision / Multimodal</option>
                <option value="coding">Coding & Sandbox</option>
                <option value="ocr">OCR & Parsing</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Parameters</label>
              <input
                type="text"
                value={newModelForm.params}
                onChange={(e) => setNewModelForm({ ...newModelForm, params: e.target.value })}
                placeholder="e.g. 8.0 Billion"
                className="w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Quantization Format</label>
              <input
                type="text"
                value={newModelForm.quantization}
                onChange={(e) => setNewModelForm({ ...newModelForm, quantization: e.target.value })}
                placeholder="e.g. GGUF Q4_K_M"
                className="w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">VRAM Footprint (GB)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={newModelForm.vramGB}
                onChange={(e) => setNewModelForm({ ...newModelForm, vramGB: e.target.value })}
                className="w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-purple-300 font-bold focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Role Description</label>
            <textarea
              rows={2}
              value={newModelForm.description}
              onChange={(e) => setNewModelForm({ ...newModelForm, description: e.target.value })}
              placeholder="e.g. High-efficiency local reasoning model for document compliance."
              className="w-full bg-[#080a0f] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 font-sans text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-glow-cyan transition-all"
            >
              Register & Add
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Models;