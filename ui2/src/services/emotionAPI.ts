import { EmotionData } from '../types/emotion';
import axios from 'axios';
const emotions = [
  { emotion: 'joy', color: '#10B981', keywords: ['happy', 'excited', 'joy', 'love', 'amazing', 'wonderful', 'great', 'fantastic'] },
  { emotion: 'sadness', color: '#3B82F6', keywords: ['sad', 'depressed', 'lonely', 'hurt', 'disappointed', 'grief', 'sorrow'] },
  { emotion: 'anger', color: '#EF4444', keywords: ['angry', 'furious', 'mad', 'rage', 'hate', 'annoyed', 'frustrated'] },
  { emotion: 'fear', color: '#8B5CF6', keywords: ['scared', 'afraid', 'anxious', 'worried', 'terrified', 'nervous', 'panic'] },
  { emotion: 'surprise', color: '#F59E0B', keywords: ['surprised', 'shocked', 'amazed', 'astonished', 'unexpected', 'wow'] },
  { emotion: 'disgust', color: '#84CC16', keywords: ['disgusted', 'sick', 'revolted', 'gross', 'yuck', 'nasty'] },
  { emotion: 'trust', color: '#06B6D4', keywords: ['trust', 'faith', 'confidence', 'reliable', 'secure', 'safe'] },
  { emotion: 'anticipation', color: '#EC4899', keywords: ['excited', 'eager', 'looking forward', 'anticipating', 'expecting'] },
  { emotion: 'neutral', color: '#6B7280', keywords: ['okay', 'fine', 'normal', 'average', 'whatever', 'meh'] }
];

const getIntensity = (confidence: number): 'low' | 'medium' | 'high' => {
  if (confidence < 0.4) return 'low';
  if (confidence < 0.7) return 'medium';
  return 'high';
};

const analyzeEmotion = (emotionData: EmotionData): EmotionData => {
  const lowercaseText = emotionData.emotion.toLowerCase();
  let bestMatch = emotions[emotions.length - 1]; // default to neutral
  let maxScore = 0;

  emotions.forEach(emotionData => {
    const score = emotionData.keywords.reduce((acc, keyword) => {
      const matches = (lowercaseText.match(new RegExp(keyword, 'g')) || []).length;
      return acc + matches;
    }, 0);

    if (score > maxScore) {
      maxScore = score;
      bestMatch = emotionData;
    }
  });

  // Add some randomness to make it more realistic
  const baseConfidence = maxScore > 0 ? Math.min(0.9, 0.3 + (maxScore * 0.15)) : 0.2 + Math.random() * 0.3;
  const confidence = Math.round(baseConfidence * 100) / 100;

  return {
    emotion: bestMatch.emotion,
    confidence : emotionData.confidence || confidence,
    intensity: getIntensity(confidence),
    color: bestMatch.color
  };
};

export const emotionAPI = {
  analyzeEmotion: async (text: string): Promise<EmotionData> => {
    // Simulate API delay
    // await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    // // Simulate occasional errors
    // if (Math.random() < 0.05) {
    //   throw new Error('API temporarily unavailable. Please try again.');
    // }
     const res = await axios.post('http://localhost:5000/analyze', {
            message: text,
            user_id: 1
          });
    
    const sentiment = res.data?.sentiment.replaceAll("```json", "").replaceAll("```", "").trim();
          
    return analyzeEmotion(JSON.parse(sentiment));
  }
};