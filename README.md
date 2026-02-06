
# VeritasVoice: AI Audio Forensics

VeritasVoice is an advanced AI-generated voice detection system built for the GUVI 2026 Hackathon. It leverages Google Gemini's multimodal capabilities to perform signal-level forensic analysis on audio samples.

## Key Features
- **Multi-Language Support**: Optimized for Tamil, English, Hindi, Malayalam, and Telugu.
- **Deep Forensic Analysis**: Goes beyond simple classification to provide spectral, prosodic, and voice quality reasoning.
- **Low Latency**: Utilizes `gemini-3-flash` for high-speed, high-accuracy inference (< 2s).
- **Zero Hard-Coding**: Detection is based on real-time signal analysis rather than static rules.

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, TypeScript.
- **Engine**: Google Gemini API (`gemini-3-flash-preview`).
- **Audio Processing**: Web Audio API for real-time visualization and capture.

## Winning Strategy
Unlike standard black-box detectors, VeritasVoice provides **Explainable AI (XAI)**. Every classification includes technical justifications about harmonic structures and breath-noise patterns, making it a "Pro" forensic tool.
