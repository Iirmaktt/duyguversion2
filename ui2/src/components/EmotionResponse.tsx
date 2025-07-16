import React from 'react';
import { Message } from '../types/emotion';
import { Loader2, AlertCircle, User, Bot } from 'lucide-react';

interface EmotionResponseProps {
  message: Message;
}

const EmotionResponse: React.FC<EmotionResponseProps> = ({ message }) => {
  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      joy: '😊',
      sadness: '😢',
      anger: '😠',
      fear: '😨',
      surprise: '😮',
      disgust: '🤢',
      trust: '🤝',
      anticipation: '🤔',
      neutral: '😐',
      analyzing: '🤖'
    };
    return emojiMap[emotion] || '😐';
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-3">
      {/* User Message */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-gray-800">{message.userInput}</p>
        </div>
      </div>

      {/* AI Response */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-200 shadow-sm">
          {message.isLoading ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing emotions...</span>
            </div>
          ) : message.error ? (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{message.error}</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getEmotionEmoji(message.emotionAnalysis.emotion)}</span>
                <div>
                  <p className="font-semibold text-gray-800 capitalize">
                    {message.emotionAnalysis.emotion}
                  </p>
                  <p className="text-sm text-gray-600">
                    Confidence: {Math.round(message.emotionAnalysis.confidence * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIntensityColor(message.emotionAnalysis.intensity)}`}>
                  {message.emotionAnalysis.intensity} intensity
                </span>
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: message.emotionAnalysis.color }}
                />
              </div>
              
              {message.emotionAnalysis.confidence > 0.7 && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  I'm quite confident about this emotion detection. The text shows strong indicators of {message.emotionAnalysis.emotion}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionResponse;