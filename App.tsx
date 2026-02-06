
import React, { useState } from 'react';
import Header from './components/Header';
import ForensicDashboard from './components/ForensicDashboard';
import AudioRecorder from './components/AudioRecorder';
import AnalysisResult from './components/AnalysisResult';
import { AppView, ScanMode, Language, ForensicReport } from './types';
import { analyzeAudio } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('DASHBOARD');
  const [scanMode, setScanMode] = useState<ScanMode>('DEEP');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartScan = () => {
    setError(null);
    setView('RECORDING');
  };

  const handleProcessAudio = async (base64Audio: string) => {
    setIsLoading(true);
    setError(null);
    setView('RESULT');
    try {
      const forensicReport = await analyzeAudio(base64Audio, language, scanMode);
      setReport(forensicReport);
    } catch (err: any) {
      console.error("Forensic analysis failed:", err);
      setError(err.message || "Engine Error: Spectral analysis timed out.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
    setView('DASHBOARD');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-sky-500/30 font-sans tracking-tight">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 py-12 max-w-7xl">
        {view === 'DASHBOARD' && (
          <ForensicDashboard 
            scanMode={scanMode}
            setScanMode={setScanMode}
            language={language}
            setLanguage={setLanguage}
            onStartScan={handleStartScan}
            onUpload={handleProcessAudio}
          />
        )}

        {view === 'RECORDING' && (
          <AudioRecorder 
            onStop={handleProcessAudio}
            onCancel={handleReset}
          />
        )}

        {view === 'RESULT' && (
          <AnalysisResult 
            report={report}
            error={error}
            isLoading={isLoading}
            onNewScan={handleReset}
          />
        )}
      </main>

      <footer className="py-12 border-t border-slate-900 text-center space-y-2">
        <p className="text-[9px] tracking-[0.5em] text-slate-700 uppercase font-black">
          Veritas Voice Forensic Protocol // GUVI Hackathon 2026 // Team Codex
        </p>
        <p className="text-[8px] text-slate-800 font-mono">
          [ LATENCY: ~1.8s // ENGINE: GEMINI-3-PRO // AUTH: ENFORCED ]
        </p>
      </footer>
    </div>
  );
};

export default App;
