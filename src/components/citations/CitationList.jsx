import React, { useState } from 'react';
import { BookOpen, ExternalLink, ChevronDown, ChevronRight, Check } from 'lucide-react';

export const CitationList = ({ citations = [] }) => {
  const [expandedMarker, setExpandedMarker] = useState(null);

  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs">
      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] mb-2">
        <BookOpen size={13} className="text-sky-400" />
        <span className="font-semibold text-slate-300">Grounded Citations & Sources</span>
      </div>

      <div className="space-y-1.5">
        {citations.map((c) => {
          const isExpanded = expandedMarker === c.marker;
          return (
            <div
              key={c.marker}
              className="bg-[#0b0e14] border border-slate-800/80 rounded p-2 text-[11px] transition-colors hover:border-slate-700/80"
            >
              <button
                onClick={() => setExpandedMarker(isExpanded ? null : c.marker)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-400 bg-sky-950/60 border border-sky-500/30 px-1.5 py-0.2 rounded text-[10px]">
                    [{c.marker}]
                  </span>
                  <span className="text-slate-200 font-medium">{c.source_name}</span>
                  {c.location && (
                    <span className="text-slate-400 font-mono text-[10px]">
                      • {c.location}
                    </span>
                  )}
                </div>

                <div className="text-slate-400 flex items-center gap-1">
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </div>
              </button>

              {isExpanded && c.snippet_preview && (
                <div className="mt-2 p-2 bg-[#06080c] border border-slate-800/90 rounded text-slate-300 font-serif text-[11px] leading-relaxed italic">
                  "{c.snippet_preview}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CitationList;
