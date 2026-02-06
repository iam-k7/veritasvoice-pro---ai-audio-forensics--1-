
import React, { useRef, useState, useEffect } from 'react';
import { ScanMode, Language } from '../types';

interface Props {
  scanMode: ScanMode;
  setScanMode: (mode: ScanMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onStartScan: () => void;
  onUpload: (base64: string) => void;
}

const ForensicDashboard: React.FC<Props> = ({ 
  scanMode, setScanMode, language, setLanguage, onStartScan, onUpload 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ticker, setTicker] = useState<string>("KERNEL_IDLE");

  useEffect(() => {
    const statuses = [
      "MONITORING_ACOUSTIC_NODES",
      "CORE_DSP_STABLE",
      "PHONETIC_V6.0_ENGAGED",
      "AUTH_CIPHER_VERIFIED",
      "SUB_1.8S_LATENCY_OPTIMIZED"
    ];
    let i = 0;
    const interval = setInterval(() => {
      setTicker(statuses[i]);
      i = (i + 1) % statuses.length;
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        onUpload(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in duration-1000 pb-32">
      {/* Precision Status Bar */}
      <div className="mb-20 px-8 py-3 bg-slate-950 border border-slate-900 rounded-full flex items-center gap-6 shadow-2xl">
         <div className="flex items-center gap-2 pr-6 border-r border-slate-800">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-500 font-black tracking-widest">NODE_01</span>
         </div>
         <span className="text-[9px] font-mono text-slate-500 font-bold tracking-[0.5em]">{ticker}</span>
      </div>

      {/* Title & Brand */}
      <div className="text-center mb-32 space-y-10">
        <div className="inline-block px-4 py-1.5 rounded-lg bg-sky-500/5 border border-sky-500/10 text-[9px] font-black text-sky-500 uppercase tracking-[0.8em] mb-4">
          Winning_Protocol_v6
        </div>
        <h1 className="text-[9rem] md:text-[14rem] font-black tracking-[-0.08em] text-slate-100 italic leading-none select-none hover:tracking-[-0.05em] transition-all cursor-crosshair">
          VERITAS<span className="text-sky-500">VOICE</span>
        </h1>
        <div className="flex items-center justify-center gap-10 text-slate-600 font-mono text-[9px] uppercase tracking-[0.6em] font-black">
           <span className="hover:text-sky-400 transition-colors cursor-default">SIGNAL_INTEGRITY</span>
           <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
           <span className="hover:text-sky-400 transition-colors cursor-default">ACOUSTIC_HASHING</span>
           <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
           <span className="hover:text-sky-400 transition-colors cursor-default">PHONETIC_CORE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full max-w-[1400px] px-6">
        {/* Param Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-12 rounded-[56px] bg-slate-900/40 border border-slate-800 glass-card shadow-2xl space-y-12">
            <h4 className="text-[10px] font-black text-sky-500 uppercase tracking-[0.5em] border-b border-slate-800 pb-8 flex justify-between items-center">
               Kernel_Config
               <span className="text-slate-800 text-[8px]">ADJUSTABLE</span>
            </h4>
            
            <div className="space-y-10">
              <div className="space-y-6">
                <label className="text-[9px] text-slate-700 uppercase font-black tracking-widest block">Audit_Depth</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'QUICK', label: 'LITE_SCAN', color: 'sky' },
                    { id: 'DEEP', label: 'FULL_FORENSIC', color: 'purple' }
                  ].map(mode => (
                    <button 
                      key={mode.id}
                      onClick={() => setScanMode(mode.id as ScanMode)}
                      className={`py-4 text-[9px] font-black rounded-2xl border transition-all ${scanMode === mode.id ? `bg-${mode.color}-500/10 border-${mode.color}-500/30 text-${mode.color}-400` : 'bg-slate-950/50 border-slate-800 text-slate-600 hover:text-slate-400'}`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[9px] text-slate-700 uppercase font-black tracking-widest block">Linguistic_Context</label>
                <div className="relative">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl py-5 px-6 text-[10px] font-black text-slate-200 focus:border-sky-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {Object.values(Language).map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                     <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="p-10 rounded-[48px] bg-slate-950 border border-slate-900 flex items-center justify-between shadow-xl">
             <div className="space-y-2">
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Engine_Grade</div>
                <div className="text-sm font-black text-emerald-500 italic uppercase">Enterprise_Pro</div>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
             </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <button 
            onClick={onStartScan}
            className="group flex flex-col items-start justify-end p-16 rounded-[64px] bg-slate-900/10 border border-slate-900 hover:border-sky-500/30 hover:bg-sky-500/[0.02] transition-all duration-500 h-[560px] relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-16 left-16 w-24 h-24 rounded-[32px] bg-sky-500/5 border border-sky-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-500/10 transition-all duration-500">
               <svg className="w-10 h-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth={1.5}/></svg>
            </div>
            <div className="space-y-6 relative z-10 text-left">
               <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.5em]">Protocol_Signal</span>
               <h3 className="text-7xl font-black text-slate-100 italic tracking-tighter group-hover:translate-x-2 transition-transform">RECORD_LIVE</h3>
               <p className="text-slate-500 text-sm font-light max-w-[280px] leading-relaxed">Execute real-time acoustic fingerprinting to verify human biometric transients.</p>
            </div>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="group flex flex-col items-start justify-end p-16 rounded-[64px] bg-slate-900/10 border border-slate-900 hover:border-purple-500/30 hover:bg-purple-500/[0.02] transition-all duration-500 h-[560px] relative overflow-hidden shadow-2xl"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="audio/*" />
            <div className="absolute top-16 left-16 w-24 h-24 rounded-[32px] bg-purple-500/5 border border-purple-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/10 transition-all duration-500">
               <svg className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth={1.5}/></svg>
            </div>
            <div className="space-y-6 relative z-10 text-left">
               <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.5em]">Protocol_Archive</span>
               <h3 className="text-7xl font-black text-slate-100 italic tracking-tighter group-hover:translate-x-2 transition-transform">IMPORT_DATA</h3>
               <p className="text-slate-500 text-sm font-light max-w-[280px] leading-relaxed">Upload mastering-grade WAV/MP3 files for sub-harmonic forensic decomposition.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForensicDashboard;
