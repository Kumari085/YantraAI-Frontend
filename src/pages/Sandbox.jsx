import React, { useState } from 'react';
import { Braces, CheckCircle2, ChevronDown, FilePlus2, Play, RotateCcw, ShieldCheck, Terminal, XCircle } from 'lucide-react';
import FileAttachmentList from '../components/workspace/FileAttachmentList';
import sandboxApi from '../services/sandbox.api';

const LANGUAGE_OPTIONS = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
];

const STARTER_CODE = {
  python: 'def main():\n    print("YantraAI sandbox ready")\n\n\nif __name__ == "__main__":\n    main()\n',
  javascript: 'function main() {\n  console.log("YantraAI sandbox ready");\n}\n\nmain();\n',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "YantraAI sandbox ready" << std::endl;\n    return 0;\n}\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("YantraAI sandbox ready");\n    }\n}\n',
};

export const Sandbox = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_CODE.python);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('ready');
  const [contextFiles, setContextFiles] = useState([]);
  const [executionError, setExecutionError] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [exitCode, setExitCode] = useState(null);
  const [isMockResponse, setIsMockResponse] = useState(false);
  const [executionHistory, setExecutionHistory] = useState([]);

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    setCode(STARTER_CODE[nextLanguage]);
    setStatus('ready');
    setExecutionError(null);
    setExecutionTime(null);
    setConsoleOutput('');
    setExitCode(null);
    setIsMockResponse(false);
  };

  const handleReset = () => {
    setCode(STARTER_CODE[language]);
    setInput('');
    setStatus('ready');
    setContextFiles([]);
    setExecutionError(null);
    setExecutionTime(null);
    setConsoleOutput('');
    setExitCode(null);
    setIsMockResponse(false);
  };

  const handleContextFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []).map((file) => ({
      id: `sandbox-file-${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'local',
      file,
    }));
    setContextFiles((previous) => [...previous, ...selectedFiles]);
    event.target.value = '';
  };

  const removeContextFile = (fileId) => {
    setContextFiles((previous) => previous.filter((file) => file.id !== fileId));
  };

  const handleRun = async () => {
    setStatus('running');
    setExecutionError(null);
    setConsoleOutput('');
    setExecutionTime(null);
    setExitCode(null);
    setIsMockResponse(false);

    try {
      const result = await sandboxApi.execute({
        language,
        code,
        input,
        files: contextFiles,
      });
      setStatus(result.status || 'completed');
      setConsoleOutput(result.output || '');
      setExecutionError(result.error || null);
      setExecutionTime(result.execution_time ?? null);
      setExitCode(result.exit_code ?? null);
      setIsMockResponse(Boolean(result.is_mock));
      setExecutionHistory((previous) => [
        {
          id: Date.now(),
          language,
          status: result.error ? 'failed' : result.status || 'completed',
          executionTime: result.execution_time ?? null,
          isMock: Boolean(result.is_mock),
        },
        ...previous,
      ].slice(0, 5));
    } catch (error) {
      setStatus('failed');
      setExecutionError(error.message || 'Sandbox request failed.');
      setExitCode(null);
      setExecutionHistory((previous) => [
        { id: Date.now(), language, status: 'failed', executionTime: null, isMock: false },
        ...previous,
      ].slice(0, 5));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <Braces className="text-emerald-400" size={20} />
            <span>User Sandbox</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Prepare code for execution in the isolated YantraAI sandbox service.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-300 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck size={14} />
          <span>SERVER-SIDE ISOLATION REQUIRED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)] gap-4">
        <section className="bg-[#0e121a] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 bg-[#101521]">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Terminal size={14} className="text-emerald-400" />
              <span>main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : 'java'}</span>
            </div>
            <label className="relative flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>Language</span>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="appearance-none bg-[#080a0f] border border-slate-700 rounded-md pl-2.5 pr-7 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500/60"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
            </label>
          </div>

          <div className="relative min-h-[420px] bg-[#080a0f]">
            <div className="absolute left-0 top-0 bottom-0 w-11 border-r border-slate-800/80 bg-[#0a0d13] text-right text-[11px] leading-6 text-slate-600 font-mono pt-4 pr-2 select-none">
              {code.split('\n').map((_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setStatus('ready');
              }}
              spellCheck="false"
              aria-label="Sandbox code editor"
              className="w-full min-h-[420px] resize-y bg-transparent text-emerald-100 font-mono text-[13px] leading-6 pl-14 pr-4 py-4 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-800 bg-[#101521]">
            <span className="text-[10px] font-mono text-slate-500">UNSAVED BUFFER // {code.length} CHARS</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleRun}
                disabled={status === 'running'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold font-mono transition-colors"
              >
                <Play size={13} />
                <span>{status === 'running' ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <section className="bg-[#0e121a] border border-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">Context Files</h2>
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-mono cursor-pointer transition-colors">
                <FilePlus2 size={12} />
                <span>Add files</span>
                <input
                  type="file"
                  multiple
                  onChange={handleContextFiles}
                  className="sr-only"
                  accept=".txt,.md,.csv,.json,.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
              </label>
            </div>
            <div className="p-3 min-h-[68px]">
              {contextFiles.length > 0 ? (
                <FileAttachmentList attachments={contextFiles} onRemove={removeContextFile} />
              ) : (
                <p className="text-[11px] text-slate-500 font-mono">No local context files attached.</p>
              )}
              <p className="text-[10px] text-slate-600 font-mono mt-2">Files are staged locally for the secure request.</p>
            </div>
          </section>

          <section className="bg-[#0e121a] border border-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">Input</h2>
              <span className="text-[10px] text-slate-500 font-mono">STDIN</span>
            </div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={7}
              placeholder="Optional input passed to the sandbox process..."
              className="w-full resize-y bg-[#080a0f] text-slate-200 placeholder-slate-600 font-mono text-xs p-4 focus:outline-none"
            />
          </section>

          <section className="bg-[#0e121a] border border-slate-800 rounded-xl shadow-lg overflow-hidden min-h-[245px]">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">Console</h2>
              <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase ${status === 'running' ? 'text-amber-300' : executionError ? 'text-rose-300' : status === 'completed' ? 'text-emerald-300' : 'text-slate-500'}`}>
                {executionError ? <XCircle size={11} /> : status === 'completed' ? <CheckCircle2 size={11} /> : null}
                {executionError ? 'failed' : status}
              </span>
            </div>
            <div className="p-4 text-xs font-mono leading-relaxed">
              {executionError ? (
                <span className="text-rose-300">{executionError}</span>
              ) : status === 'running' ? (
                <span className="text-amber-300">Execution request in progress through the secure sandbox service...</span>
              ) : consoleOutput ? (
                <pre className="whitespace-pre-wrap text-slate-300">{consoleOutput}</pre>
              ) : (
                <span className="text-slate-500">Output will appear here after the secure sandbox service responds.</span>
              )}
              {(executionTime !== null || exitCode !== null) && (
                <div className="mt-3 flex items-center gap-4 border-t border-slate-800 pt-3 text-[10px] text-slate-500">
                  {executionTime !== null && <span>Execution time: {executionTime}s</span>}
                  {exitCode !== null && <span>Exit status: {exitCode}</span>}
                  {isMockResponse && <span className="text-amber-300">MOCK FALLBACK</span>}
                </div>
              )}
            </div>
          </section>

          {executionHistory.length > 0 && (
            <section className="bg-[#0e121a] border border-slate-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">Recent Runs</h2>
                <span className="text-[10px] text-slate-500 font-mono">LOCAL SESSION</span>
              </div>
              <div className="divide-y divide-slate-800/80">
                {executionHistory.map((run) => (
                  <div key={run.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[10px] font-mono">
                    <span className="text-slate-400 uppercase">{run.language}</span>
                    <span className={run.status === 'failed' ? 'text-rose-300' : 'text-emerald-300'}>{run.status}</span>
                    <span className="text-slate-500">{run.executionTime !== null ? `${run.executionTime}s` : '--'}</span>
                    {run.isMock && <span className="text-amber-300">MOCK</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
