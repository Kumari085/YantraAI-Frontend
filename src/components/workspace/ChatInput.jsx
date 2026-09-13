import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Square,
  Paperclip,
  Wrench,
  ChevronDown,
  Cpu,
  Eye,
  Code2,
  FileText,
  Sparkles,
  Check,
  Zap,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import FileAttachmentList from './FileAttachmentList';

export const ChatInput = () => {
  const {
    sendMessage,
    cancelGeneration,
    isGenerating,
    runMode,
    setRunMode,
    modelMode,
    setModelMode,
    requestedModelId,
    setRequestedModelId,
    activeTools,
    setActiveTools,
    attachments,
    attachFiles,
    removeAttachment,
  } = useWorkspace();

  const [inputVal, setInputVal] = useState('');
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Available local models
  const availableModels = [
    { id: 'model-reasoning-qwen', name: 'Qwen 2.5 32B (Reasoning)', category: 'reasoning', vram: '24 GB' },
    { id: 'model-vision-internvl', name: 'InternVL2 26B (Vision)', category: 'vision', vram: '32 GB' },
    { id: 'model-coding-deepseek', name: 'DeepSeek Coder 33B (Code)', category: 'coding', vram: '28 GB' },
    { id: 'model-ocr-nougat', name: 'Nougat OCR v0.1 (Doc Parser)', category: 'ocr', vram: '8 GB' },
  ];

  // Available sandbox tools
  const availableToolsList = [
    { id: 'tool-code-execution', name: 'Python Sandbox', desc: 'Isolated code execution' },
    { id: 'tool-vision', name: 'Vision Engine', desc: 'Equipment defect analysis' },
    { id: 'tool-ocr', name: 'OCR Extractor', desc: 'Scanned document parsing' },
    { id: 'tool-rag', name: 'Knowledge Search', desc: 'ASME/SOP vector database' },
    { id: 'tool-file-read', name: 'Document Reader', desc: 'PDF, DOCX, XLSX inspection' },
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputVal]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isGenerating) {
      cancelGeneration();
      return;
    }

    if (!inputVal.trim() && attachments.length === 0) return;

    sendMessage(inputVal);
    setInputVal('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      attachFiles(e.target.files);
      e.target.value = '';
    }
  };

  const toggleTool = (toolId) => {
    setActiveTools((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const isSubmitDisabled = !inputVal.trim() && attachments.length === 0 && !isGenerating;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* File attachments chip row */}
      <FileAttachmentList attachments={attachments} onRemove={removeAttachment} />

      {/* Main command bar box */}
      <div className="relative bg-[#0e121a] border border-slate-700/70 hover:border-slate-600 focus-within:border-sky-500/50 rounded-2xl shadow-xl transition-all p-3">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
          accept=".pdf,.docx,.xlsx,.pptx,.txt,.csv,.png,.jpg,.jpeg,.webp"
        />

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask YantraAI sovereign orchestrator anything..."
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none px-1 py-1 max-h-[180px] leading-relaxed font-sans"
        />

        {/* Bottom controls row */}
        <div className="flex items-center justify-between gap-2 pt-2 mt-1 border-t border-slate-800/60 select-none">
          {/* Left toolbar items: Attach & Tools Popover */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#161c28] text-xs font-mono transition-colors"
              title="Attach confidential files or images"
            >
              <Paperclip size={13} />
              <span>Attach</span>
            </button>

                     {/* Model Selector Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowModelMenu(!showModelMenu);
                  setShowToolsMenu(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-300 hover:bg-[#161c28] text-xs font-mono transition-colors border border-slate-800"
              >
                <Cpu size={12} className="text-sky-400" />
                <span className="truncate max-w-[90px]">
                  {modelMode === 'auto' ? 'Auto Model' : availableModels.find(m => m.id === requestedModelId)?.name.split(' ')[0]}
                </span>
                <ChevronDown size={10} className="text-slate-500" />
              </button>

              {/* Model Menu Dropdown */}
              {showModelMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-72 bg-[#0a0d14] border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[11px] font-mono text-slate-400 font-semibold px-2 py-1 border-b border-slate-800 mb-1">
                    Orchestrator Routing Mode
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setModelMode('auto');
                        setShowModelMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        modelMode === 'auto'
                          ? 'bg-sky-950/40 text-sky-200 border border-sky-500/20'
                          : 'text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-200 text-[11px] flex items-center gap-1.5">
                          <Zap size={12} className="text-amber-400" /> Auto Orchestrator
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Dynamic routing based on task domain
                        </div>
                      </div>
                      {modelMode === 'auto' && <Check size={13} className="text-sky-400" />}
                    </button>

                    <div className="text-[10px] font-mono text-slate-500 px-2 pt-1 border-t border-slate-800/60">
                      Manual Model Selection
                    </div>

                    {availableModels.map((model) => {
                      const isSelected = modelMode === 'manual' && requestedModelId === model.id;
                      return (
                        <button
                          key={model.id}
                          onClick={() => {
                            setModelMode('manual');
                            setRequestedModelId(model.id);
                            setShowModelMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                            isSelected
                              ? 'bg-sky-950/40 text-sky-200 border border-sky-500/20'
                              : 'text-slate-400 hover:bg-slate-800/60'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-slate-200 text-[11px]">
                              {model.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              category: {model.category}
                            </div>
                          </div>
                          {isSelected && <Check size={13} className="text-sky-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tools popover trigger */}
          {/*  <div className="relative">
               <button
                type="button"
                onClick={() => {
                  setShowToolsMenu(!showToolsMenu);
                  setShowModelMenu(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  showToolsMenu
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#161c28]'
                }`}
              >
                <Wrench size={13} />
                <span>Tools ({activeTools.length})</span>
                <ChevronDown size={11} />
              </button> */}

              {/* Tools Popover Menu */}
              {/* {showToolsMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#0a0d14] border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[11px] font-mono text-slate-400 font-semibold px-2 py-1 border-b border-slate-800 mb-1">
                    Sandbox Tool Registry
                  </div>
                  <div className="space-y-1">
                    {availableToolsList.map((tool) => {
                      const isActive = activeTools.includes(tool.id);
                      return (
                        <button
                          key={tool.id}
                          onClick={() => toggleTool(tool.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                            isActive
                              ? 'bg-sky-950/40 text-sky-200 border border-sky-500/20'
                              : 'text-slate-400 hover:bg-slate-800/60'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-slate-200 text-[11px]">
                              {tool.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {tool.desc}
                            </div>
                          </div>
                          {isActive && <Check size={13} className="text-sky-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )} 
            </div>*/}
          </div>

          {/* Right toolbar items: Run Mode Switcher, Model Mode Dropdown, Send button */}
          <div className="flex items-center gap-2">
            {/* Mode Switcher Pill */}
            {/* <div className="flex items-center bg-[#07090f] p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setRunMode('agent')}
                className={`px-2.5 py-0.5 rounded-md transition-colors ${
                  runMode === 'agent'
                    ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Agent
              </button>
              <button
                type="button"
                onClick={() => setRunMode('normal')}
                className={`px-2.5 py-0.5 rounded-md transition-colors ${
                  runMode === 'normal'
                    ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Chat
              </button>
            </div> */}

 

            {/* Send / Stop Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                isGenerating
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                  : isSubmitDisabled
                  ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-glow-cyan'
              }`}
              title={isGenerating ? 'Cancel generation (Esc)' : 'Send message (Enter)'}
            >
              {isGenerating ? <Square size={14} className="fill-current" /> : <ArrowUp size={15} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
