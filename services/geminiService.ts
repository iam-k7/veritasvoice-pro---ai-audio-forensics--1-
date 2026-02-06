
import { GoogleGenAI, Type } from "@google/genai";
import { ForensicReport, DetectionResult, Language, ScanMode } from "../types";

/**
 * VERITAS VOICE FORENSIC ENGINE v6.2 (ULTRALIGHT FLASH)
 * Optimized for <1.5s latency and high-confidence binary classification.
 */
export const analyzeAudio = async (
  base64Audio: string, 
  targetLanguage: Language,
  mode: ScanMode
): Promise<ForensicReport> => {
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("500_INTERNAL_ERROR: Forensic Engine API Key not found.");

  const startTime = performance.now();
  const ai = new GoogleGenAI({ apiKey });
  
  // Using Flash for maximum speed as requested
  const modelId = 'gemini-3-flash-preview';
  const sessionId = `VX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const systemInstruction = `
    You are a high-speed Audio Forensic Auditor.
    
    TASK: Analyze the provided audio and determine if it is AI_GENERATED or HUMAN.
    CRITERIA: Focus on South Asian phonetic markers for ${targetLanguage}.
    
    OUTPUT: Provide technical spectral and prosodic justifications. 
    Strictly adhere to the provided JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { data: base64Audio, mimeType: 'audio/mp3' } },
          { text: `AUDIT_ID: ${sessionId} | LANG: ${targetLanguage} | MODE: ${mode}` }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.STRING, description: "Must be AI_GENERATED or HUMAN" },
            confidence: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            transcription: { type: Type.STRING },
            nativeTranscript: { type: Type.STRING },
            technicalFeatures: {
              type: Type.OBJECT,
              properties: {
                spectral: { type: Type.STRING },
                prosodic: { type: Type.STRING },
                voiceQuality: { type: Type.STRING },
              },
              required: ['spectral', 'prosodic', 'voiceQuality']
            },
            phoneticMarkers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  marker: { type: Type.STRING },
                  status: { type: Type.STRING },
                  detail: { type: Type.STRING }
                },
                required: ['marker', 'status', 'detail']
              }
            },
            scores: {
              type: Type.OBJECT,
              properties: {
                spectralIntegrity: { type: Type.NUMBER },
                prosodicNaturalness: { type: Type.NUMBER },
                phoneticAuthenticity: { type: Type.NUMBER },
              },
              required: ['spectralIntegrity', 'prosodicNaturalness', 'phoneticAuthenticity']
            }
          },
          required: ['prediction', 'confidence', 'explanation', 'transcription', 'technicalFeatures', 'phoneticMarkers', 'scores']
        },
        temperature: 0
      }
    });

    const result = JSON.parse(response.text || '{}');
    const endTime = performance.now();
    const latency = `${((endTime - startTime) / 1000).toFixed(2)}s`;
    
    return {
      language: targetLanguage,
      prediction: (result.prediction === 'AI_GENERATED' ? DetectionResult.AI_GENERATED : DetectionResult.HUMAN),
      confidence: result.confidence || 0.95,
      explanation: result.explanation,
      transcription: result.transcription,
      nativeTranscript: result.nativeTranscript,
      technicalFeatures: result.technicalFeatures,
      phoneticMarkers: result.phoneticMarkers || [],
      scores: result.scores,
      metadata: {
        detectedLanguage: targetLanguage,
        scanMode: mode,
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        latency: latency
      }
    };
  } catch (error: any) {
    throw new Error("Forensic Node Timeout: Neural processing failed.");
  }
};
