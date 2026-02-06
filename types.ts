
export enum Language {
  ENGLISH = 'ENGLISH',
  TAMIL = 'TAMIL',
  HINDI = 'HINDI',
  MALAYALAM = 'MALAYALAM',
  TELUGU = 'TELUGU'
}

export enum DetectionResult {
  AI_GENERATED = 'AI_GENERATED',
  HUMAN = 'HUMAN',
  UNCERTAIN = 'UNCERTAIN'
}

export interface PhoneticMarker {
  marker: string;
  status: 'PASS' | 'FAIL' | 'INCONSISTENT';
  detail: string;
}

export interface ForensicReport {
  language: string;
  prediction: DetectionResult;
  confidence: number;
  explanation: string;
  transcription?: string;
  nativeTranscript?: string;
  technicalFeatures: {
    spectral: string;
    prosodic: string;
    voiceQuality: string;
  };
  phoneticMarkers: PhoneticMarker[];
  scores: {
    spectralIntegrity: number; 
    prosodicNaturalness: number; 
    phoneticAuthenticity: number; 
  };
  metadata: {
    detectedLanguage: string;
    scanMode: string;
    timestamp: string;
    sessionId: string;
    latency: string; // Performance metric
  };
}

export type ScanMode = 'QUICK' | 'DEEP';
export type AppView = 'DASHBOARD' | 'RECORDING' | 'RESULT';
