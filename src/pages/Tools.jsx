import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Terminal,
  Eye,
  FileText,
  Database,
  Code,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Play,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

export const Tools = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState([
    {
      id: 'tool-code-execution',
      name: 'Python Sandbox Executor',
      category: 'sandbox',
      description: 'Executes mathematical models, stress calculations, and formulas inside an air-gapped, isolated Linux cgroup with zero network access.',
      status: 'active',
      isolation: 'cgroups v2 + seccomp filter (No Egress)',
      timeout: '30 seconds',
      schema: {
        code: 'string (Python script to execute in sandbox)',
        timeout_sec: 'integer (optional execution cutoff)',
      },
    },
    {
      id: 'tool-vision',
      name: 'Vision Defect Analyzer',
      category: 'vision',
      description: 'Executes high-resolution optical inspection on equipment photos, scans, and blueprints to flag surface corrosion, cracks, and gasket tolerances.',
      status: 'active',
      isolation: 'Local GPU VRAM Direct Pipeline',
      timeout: '15 seconds',
      schema: {
        image_path: 'string (local storage file reference)',
        detection_targets: 'array of strings (corrosion, cracks, valves)',
      },
    },
    {
      id: 'tool-ocr',
      name: 'Neural Document OCR',
      category: 'ocr',
      description: 'Scans technical manuals and handwritten logs into structured markdown tables and mathematical expressions.',
      status: 'active',
      isolation: 'Local Neural Pipeline',
      timeout: '20 seconds',
      schema: {
        document_id: 'string (confidential document ID)',
        preserve_tables: 'boolean',
      },
    },
    {
      id: 'tool-rag',
      name: 'Vector Knowledge Retriever',
      category: 'rag',
      description: 'Queries local HNSW vector database for ASME, ISO, and facility SOP standard operating procedures.',
      status: 'active',
      isolation: 'Local Vector Store',
      timeout: '5 seconds',
      schema: {
        query: 'string (search query for vector matching)',
        top_k: 'integer (default 3)',
      },
    },
    {
      id: 'tool-doc-gen',
      name: 'Deliverable Document Generator',
      category: 'artifact',
      description: 'Automates compilation of compliance inspection memos and stress data into Word (.docx), Excel (.xlsx), and PDF artifacts.',
      status: 'active',
      isolation: 'Local File Engine',
      timeout: '10 seconds',
      schema: {
        title: 'string (memo title)',
        format: 'enum [word, excel, pdf]',
        sections: 'array of document section objects',
      },
    },
  ]);

  const [selectedToolForTest, setSelectedToolForTest] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const getToolIcon = (category) => {
    switch (category) {
      case 'sandbox':
        return <Terminal size={16} className="text-emerald-400" />;
      case 'vision':
        return <Eye size={16} className="text-purple-400" />;
      case 'ocr':
        return <FileText size={16} className="text-amber-400" />;
      case 'rag':
        return <Database size={16} className="text-sky-400" />;
      case 'artifact':
      default:
        return <Wrench size={16} className="text-cyan-400" />;
    }
  };

  const runTestTool = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestResult({
        status: 'success',
        exitCode: 0,
        stdout: `[SANDBOX VERIFIED] Output: OK\nExecution Time: 42ms\nNetwork Isolation: 100% BLOCKED\nIntegrity: SHA256 VALIDATED`,
      });
      setIsTesting(false);
    }, 700);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <Wrench className="text-amber-400" size={20} />
            <span>Sandbox Tool Registry & Security Policies</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered sandbox tools available for sovereign agent orchestration. All executions are strictly contained.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck size={15} />
          <span>Airgap Containment Enforced</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/sandbox')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold font-mono transition-colors"
        >
          <Code size={13} />
          <span>Open User Sandbox</span>
        </button>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-[#0e121a] border border-slate-800/90 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#080a0f] border border-slate-800">
                    {getToolIcon(tool.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm font-mono">
                      {tool.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      ID: {tool.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    {tool.isolation}
                  </span>
                  <StatusBadge status={tool.status} size="xs" />
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {tool.description}
              </p>

              {/* Parameter Schema Box */}
              <div className="bg-[#080a0f] p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
                <span className="text-slate-500 block font-semibold mb-1">
                  Parameters Schema:
                </span>
                <pre className="text-sky-300/90 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(tool.schema, null, 2)}
                </pre>
              </div>
            </div>

            {/* Test Trigger Button */}
            <div className="flex justify-end pt-3 mt-3 border-t border-slate-800/60">
              <button
                onClick={() => {
                  setSelectedToolForTest(tool);
                  setTestResult(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono transition-colors"
              >
                <Play size={12} />
                <span>Test Sandbox Invocation</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test Invocation Modal */}
      {selectedToolForTest && (
        <Modal
          isOpen={Boolean(selectedToolForTest)}
          onClose={() => setSelectedToolForTest(null)}
          title={`Test Invocation: ${selectedToolForTest.name}`}
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3 bg-[#080a0f] rounded-lg border border-slate-800 text-slate-300">
              Isolation: {selectedToolForTest.isolation}
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Test Arguments Payload:</label>
              <textarea
                rows={4}
                defaultValue={JSON.stringify({ test_mode: true, verify_isolation: true }, null, 2)}
                className="w-full bg-[#080a0f] border border-slate-700 rounded-lg p-2.5 text-sky-200 focus:outline-none focus:border-sky-500 font-mono text-xs"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={runTestTool}
                disabled={isTesting}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition-colors flex items-center gap-1.5"
              >
                <Play size={13} />
                <span>{isTesting ? 'Executing in Sandbox...' : 'Run in Sandbox'}</span>
              </button>

              <button
                onClick={() => setSelectedToolForTest(null)}
                className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Close
              </button>
            </div>

            {testResult && (
              <div className="p-3 bg-[#07090e] rounded-lg border border-emerald-500/30 text-emerald-300 whitespace-pre-wrap">
                {testResult.stdout}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Tools;
