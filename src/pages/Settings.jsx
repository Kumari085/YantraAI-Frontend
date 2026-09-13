import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Radio,
  Sliders,
  Shield,
  Save,
  Check,
  RefreshCw,
} from 'lucide-react';
import { CONFIG } from '../services/config';
import { useWebSocket } from '../context/WebSocketContext';

export const Settings = () => {
  const { reconnect } = useWebSocket();
  const [apiBaseUrl, setApiBaseUrl] = useState(CONFIG.API_BASE_URL);
  const [wsUrl, setWsUrl] = useState(CONFIG.WS_URL);
  const [orgName, setOrgName] = useState(CONFIG.ORGANIZATION_NAME);
  const [temperature, setTemperature] = useState(0.2);
  const [topP, setTopP] = useState(0.95);
  const [enableSimulator, setEnableSimulator] = useState(CONFIG.ENABLE_SIMULATOR_FALLBACK);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('aegis_api_base_url', apiBaseUrl);
    localStorage.setItem('aegis_ws_url', wsUrl);
    localStorage.setItem('aegis_org_name', orgName);
    
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);

    // Trigger reconnect with new endpoints
    reconnect();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <SettingsIcon className="text-sky-400" size={20} />
            <span>Workbench Preferences & Local Backend Config</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure REST API endpoints, WebSocket connection parameters, and inference defaults.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Backend Connection Endpoints */}
        <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Server size={14} className="text-sky-400" />
            <span>Backend Integration Endpoints</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">
                REST API Base URL (FastAPI Backend)
              </label>
              <input
                type="text"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                placeholder="http://localhost:8000/api"
                className="w-full bg-[#080a0f] border border-slate-700/80 rounded-lg px-3.5 py-2 text-slate-200 focus:outline-none focus:border-sky-500/50"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Default: <code className="text-slate-400">VITE_API_BASE_URL</code>
              </span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                WebSocket Stream URL (Live Agent Protocol)
              </label>
              <input
                type="text"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                placeholder="ws://localhost:8000/ws"
                className="w-full bg-[#080a0f] border border-slate-700/80 rounded-lg px-3.5 py-2 text-slate-200 focus:outline-none focus:border-sky-500/50"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Default: <code className="text-slate-400">VITE_WS_URL</code>
              </span>
            </div>
          </div>
        </div>

        {/* Demo Simulation Mode */}
        <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-semibold text-slate-200">
                Interactive Standalone Simulation Fallback
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically activates realistic agent loop simulation when the local FastAPI server is offline.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEnableSimulator(!enableSimulator)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                enableSimulator ? 'bg-sky-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  enableSimulator ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Inference Defaults */}
        <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders size={14} className="text-purple-400" />
            <span>Local Model Inference Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Sampling Temperature:</span>
                <span className="text-sky-400 font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Top-P Nucleus Sampling:</span>
                <span className="text-purple-400 font-bold">{topP}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <Check size={14} />
              <span>Configuration saved and WebSocket reconnected</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs shadow-glow-cyan transition-all"
          >
            <Save size={15} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
