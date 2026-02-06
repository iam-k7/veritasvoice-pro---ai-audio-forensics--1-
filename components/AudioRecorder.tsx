
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onStop: (base64: string) => void;
  onCancel: () => void;
}

const AudioRecorder: React.FC<Props> = ({ onStop, onCancel }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(100).fill(2));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // Fix: Use ReturnType<typeof setTimeout> to avoid NodeJS namespace error in browser environments
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    startRecording();
    return () => stopAll();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          onStop(base64);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);

      setupOscilloscope(stream);
    } catch (err) {
      console.error("Recording Access Denied:", err);
      onCancel();
    }
  };

  const setupOscilloscope = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 512;
    source.connect(analyzer);

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualizer = () => {
      analyzer.getByteTimeDomainData(dataArray);
      // Create a medical-style waveform scan
      const normalizedData = Array.from(dataArray.slice(0, 100)).map(v => Math.abs(v - 128) * 1.5);
      setVisualizerData(normalizedData);
      animationRef.current = requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();
  };

  const stopAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleStop = () => {
    setIsRecording(false);
    stopAll();
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
      {/* Medical-Grade Oscilloscope */}
      <div className="w-full max-w-4xl h-64 bg-slate-950/80 rounded-3xl border border-sky-500/20 mb-12 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-12 grid-rows-6">
           {Array.from({length: 72}).map((_, i) => <div key={i} className="border-[0.5px] border-sky-500" />)}
        </div>
        <div className="absolute top-4 left-6 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-bold">Signal Active // PCM_16BIT</span>
        </div>
        
        <div className="flex items-center justify-center gap-[2px] h-full w-full px-12">
          {visualizerData.map((val, i) => (
            <div 
              key={i} 
              className="w-[3px] bg-sky-400 opacity-80"
              style={{ height: `${Math.max(2, val)}%`, transition: 'height 0.05s ease' }}
            />
          ))}
        </div>
        
        {/* Scanning Line */}
        <div className="absolute inset-y-0 left-0 w-1 bg-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.5)] animate-[scan_3s_linear_infinite]" />
      </div>

      <div className="text-8xl font-black text-slate-100 mb-8 mono tracking-tighter tabular-nums italic">
        {formatTime(seconds)}
      </div>

      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={handleStop}
          className="group relative px-16 py-6 rounded-2xl bg-slate-100 text-slate-950 font-black text-xl uppercase tracking-tighter overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-sky-500/20"
        >
          <div className="absolute inset-0 bg-sky-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10 group-hover:text-white">CONCLUDE CAPTURE</span>
        </button>

        <button 
          onClick={onCancel}
          className="text-slate-600 hover:text-red-400 text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
        >
          Abort Analysis Session
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(0); }
          100% { transform: translateX(900px); }
        }
      `}</style>
    </div>
  );
};

export default AudioRecorder;
