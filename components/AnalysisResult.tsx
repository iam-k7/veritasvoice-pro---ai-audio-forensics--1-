
import React, { useState, useEffect } from 'react';
import { ForensicReport, DetectionResult } from '../types';

interface Props {
  report: ForensicReport | null;
  error: string | null;
  isLoading: boolean;
  onNewScan: () => void;
}

const AnalysisResult: React.FC<Props> = ({ report, error, isLoading, onNewScan }) => {
  const [showJson, setShowJson] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isLoading) {
      setLogs([]);
      const logSequence = [
        "BOOT_V6.2_FLASH...",
        "DECRYPTING_SIGNAL...",
        "GEN_HASH_SIG...",
        "SPECTRAL_ANALYSIS...",
        "RECOVERING_PHONETICS...",
        "LINGUISTIC_AUDIT...",
        "BREATH_VALIDATION...",
        "DOSSIER_READY."
      ];
      
      // Sped up from 500ms to 200ms for a snappier feel
      logSequence.forEach((log, i) => {
        setTimeout(() => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] >> ${log}`]), i * 200);
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-16">
        <div className="relative">
          <div className="w-64 h-64 border-[1px] border-sky-500/20 rounded-full animate-pulse" />
          <div className="absolute inset-4 border-[1px] border-sky-500/40 rounded-full animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-8 border-[1px] border-sky-500/60 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
             <div className="text-[10px] font-black text-sky-500 tracking-[1em] mb-2">SCANNING</div>
             <div className="h-1 w-12 bg-sky-500 rounded-full animate-pulse" />
          </div>
        </div>
        
        <div className="w-full max-w-xl bg-slate-950/80 border border-slate-900 rounded-2xl p-8 font-mono text-[10px] space-y-2 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
           {logs.map((log, i) => (
             <div key={i} className="text-sky-500/60 flex gap-4">
               <span className="text-sky-900 font-bold shrink-0">KERN</span> 
               <span className="truncate">{log}</span>
             </div>
           ))}
           <div className="w-2 h-4 bg-sky-500 animate-pulse mt-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-20">
        <div className="p-12 rounded-[40px] bg-red-950/20 border border-red-500/20 text-center space-y-6 backdrop-blur-xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20">
             <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth={2}/></svg>
          </div>
          <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter">System_Failure</h2>
          <p className="text-slate-500 font-mono text-xs">{error}</p>
          <button onClick={onNewScan} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-[0.4em] border border-slate-800 hover:bg-slate-800 transition-all">Flush & Reboot</button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const isAI = report.prediction === DetectionResult.AI_GENERATED;
  const colorClass = isAI ? 'text-red-500' : 'text-emerald-500';
  const borderClass = isAI ? 'border-red-500/20' : 'border-emerald-500/20';
  const bgClass = isAI ? 'bg-red-500/[0.02]' : 'bg-emerald-500/[0.02]';

  return (
    <div className="max-w-[1400px] mx-auto pb-40 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Top Banner: Status Dashboard with Speed Metric */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
         {[
           { label: 'CLASSIFICATION', value: isAI ? 'AI_GENERATED' : 'HUMAN_AUTHENTIC', color: colorClass },
           { label: 'DETECTION_SPEED', value: report.metadata.latency, color: 'text-sky-400' },
           { label: 'CONFIDENCE', value: `${(report.confidence * 100).toFixed(2)}%`, color: 'text-slate-100' },
           { label: 'LANGUAGE_CORE', value: report.metadata.detectedLanguage, color: 'text-slate-500' }
         ].map((stat, i) => (
           <div key={i} className="bg-slate-950 border border-slate-900 p-8 rounded-[32px] flex flex-col gap-2 shadow-inner">
             <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">{stat.label}</span>
             <span className={`text-2xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</span>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Hero Prediction Area */}
          <div className={`relative p-16 rounded-[60px] border ${borderClass} ${bgClass} overflow-hidden backdrop-blur-3xl shadow-2xl`}>
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-current opacity-[0.03] pointer-events-none transition-all" />
             <div className="flex items-center gap-4 mb-8">
                <div className={`w-2 h-2 rounded-full ${isAI ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Forensic Signal Identified</span>
             </div>
             
             <div className="flex flex-col md:flex-row md:items-end gap-10">
                <h2 className={`text-9xl md:text-[12rem] font-black tracking-tighter leading-none italic uppercase ${colorClass} select-none`}>
                   {isAI ? 'AI_GEN' : 'HUMAN'}
                </h2>
                <div className="pb-4 space-y-2">
                   <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Acoustic Consistency</div>
                   <div className="flex gap-1 h-8 items-end">
                      {Array.from({length: 12}).map((_, j) => (
                        <div key={j} className={`w-1.5 rounded-t-sm ${isAI ? 'bg-red-500/40' : 'bg-emerald-500/40'}`} style={{ height: `${Math.random() * 100}%` }} />
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Technical Reasoning Dossier */}
          <div className="bg-slate-950 border border-slate-900 rounded-[56px] p-16 space-y-12 shadow-2xl">
             <div className="flex items-center justify-between border-b border-slate-900 pb-10">
               <h3 className="text-[11px] font-black text-sky-500 uppercase tracking-[0.5em] flex items-center gap-3">
                 <div className="w-1 h-6 bg-sky-500" />
                 Forensic Summary Dossier
               </h3>
               <span className="text-[9px] font-mono text-slate-800">CLASS: SECURE_SCAN</span>
             </div>
             
             <p className="text-4xl md:text-5xl font-light text-slate-200 leading-[1.2] italic tracking-tight">
               "{report.explanation}"
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-900">
               <div>
                 <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Spectral Integrity Check</h4>
                 <p className="text-sm text-slate-400 font-light leading-relaxed italic">"{report.technicalFeatures.spectral}"</p>
               </div>
               <div>
                 <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Voice Signature Audit</h4>
                 <p className="text-sm text-slate-400 font-light leading-relaxed italic">"{report.technicalFeatures.voiceQuality}"</p>
               </div>
             </div>
          </div>
        </div>

        {/* Right Sidebar Area */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900/40 border border-slate-800 rounded-[48px] p-10 backdrop-blur-xl shadow-xl">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Live Intercept</span>
               </div>
               <span className="px-2 py-0.5 rounded-md bg-slate-950 text-[8px] font-mono text-slate-600">BUF_042</span>
             </div>
             
             <div className="bg-slate-950 border border-slate-900 p-8 rounded-3xl space-y-6">
                <div className="space-y-2">
                   <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Recovered_Speech (English)</span>
                   <p className="text-lg text-slate-200 font-medium leading-relaxed italic tracking-tight">
                     "{report.transcription || "Static detected. No clear linguistic data recovered."}"
                   </p>
                </div>
                {report.nativeTranscript && (
                  <div className="space-y-2 border-t border-slate-900 pt-6">
                     <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Native_Source_Script</span>
                     <p className="text-xs text-slate-500 font-mono tracking-tighter">
                       {report.nativeTranscript}
                     </p>
                  </div>
                )}
             </div>
          </div>

          <div className="bg-slate-950 border border-slate-900 rounded-[48px] p-10 space-y-8 shadow-xl">
             <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] text-center mb-4">Acoustic Scorecard</h3>
             <div className="space-y-8">
                {[
                  { label: 'Spectral Continuity', score: report.scores.spectralIntegrity },
                  { label: 'Prosodic Fluidity', score: report.scores.prosodicNaturalness },
                  { label: 'Phonetic Authenticity', score: report.scores.phoneticAuthenticity }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                      <span className="text-[11px] font-mono text-slate-300">{item.score}%</span>
                    </div>
                    <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 delay-${idx*100} ${isAI ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
             </div>

             <div className="pt-6 border-t border-slate-900">
                <button 
                  onClick={() => setShowJson(!showJson)}
                  className="w-full py-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-sky-500 transition-colors"
                >
                  {showJson ? 'Close Machine Logs' : 'Decrypt Raw Telemetry'}
                </button>
             </div>
          </div>
        </div>
      </div>

      {showJson && (
        <div className="mt-12 p-12 bg-slate-950 border border-sky-500/20 rounded-[40px] font-mono text-[10px] text-sky-500/70 overflow-x-auto shadow-2xl animate-in zoom-in duration-300">
           <div className="flex items-center justify-between mb-8 text-sky-500 font-black tracking-widest">
              <span>{'>>'} MACHINE_TELEMETRY_LOGS</span>
              <span className="px-2 py-0.5 bg-sky-500/10 rounded">READ_ONLY</span>
           </div>
           <pre className="opacity-80">{JSON.stringify(report, null, 2)}</pre>
        </div>
      )}

      <div className="fixed bottom-12 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <button 
          onClick={onNewScan}
          className="pointer-events-auto group relative px-16 py-7 bg-slate-100 text-slate-950 rounded-[32px] font-black uppercase text-[11px] tracking-[0.5em] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_60px_rgba(255,255,255,0.1)] hover:bg-sky-500 hover:text-white"
        >
          <div className="absolute -inset-2 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px]" />
          INITIALIZE_NEW_SCAN
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
