export interface EmotionData {
  emotion: string;
  confidence: number;
  intensity: 'low' | 'medium' | 'high';
  color: string;
}

export interface Message {
  id: string;
  sessionId: string;
  timestamp: number;
  userInput: string;
  emotionAnalysis: EmotionData;
  isLoading?: boolean;
  error?: string;
}

export interface EmotionSession {
  id: string;
  startTime: number;
  endTime?: number;
  messageCount: number;
  dominantEmotion: string;
}