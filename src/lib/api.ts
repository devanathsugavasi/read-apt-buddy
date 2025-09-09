// API configuration for ReadApt backend integration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com' 
  : 'http://localhost:8000';

export interface DyslexiaAssessment {
  reading_speed: number; // 0-1 scale
  survey_score: number; // 0-1 scale
}

export interface ADHDAssessment {
  questions: number[]; // 18 questions, 0-3 scale each
}

export interface VisionAssessment {
  glasses_power: number; // Prescription power
}

export interface TextAdaptationRequest {
  text: string;
  dyslexia_level?: string;
  adhd_level?: string;
  vision_level?: string;
  preferences?: Record<string, any>;
}

export interface TTSRequest {
  text: string;
  condition?: string;
  voice_config?: Record<string, any>;
}

export class ReadAptAPI {
  private static async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Assessment APIs
  static async predictDyslexia(assessment: DyslexiaAssessment) {
    return this.request('/api/dyslexia/predict', {
      method: 'POST',
      body: JSON.stringify(assessment),
    });
  }

  static async predictADHD(assessment: ADHDAssessment) {
    return this.request('/api/adhd/predict', {
      method: 'POST',
      body: JSON.stringify(assessment),
    });
  }

  static async classifyVision(assessment: VisionAssessment) {
    return this.request('/api/adaptation/vision/classify', {
      method: 'POST',
      body: JSON.stringify(assessment),
    });
  }

  // Text Processing APIs
  static async adaptText(request: TextAdaptationRequest) {
    return this.request('/api/adaptation/adapt-text', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async getAdaptationPresets() {
    return this.request('/api/adaptation/presets');
  }

  static async getCSSStyles() {
    return this.request('/api/adaptation/css-styles');
  }

  // TTS APIs
  static async textToSpeech(request: TTSRequest) {
    return this.request('/api/tts/speak', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async getVoiceConfigs() {
    return this.request('/api/tts/voice-configs');
  }

  // AI Agent APIs
  static async intelligentRouting(request: any) {
    return this.request('/api/agents/intelligent-routing', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async getAgentStatus() {
    return this.request('/api/agents/status');
  }
}