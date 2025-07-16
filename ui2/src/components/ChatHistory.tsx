import React from 'react';
import { useEmotionStore } from '../store/emotionStore';
import EmotionResponse from './EmotionResponse';
import { MessageSquare, Trash2, RotateCcw } from 'lucide-react';

const ChatHistory: React.FC = () => {
  const { currentMessages, clearCurrentSession, startNewSession } = useEmotionStore();

  if (currentMessages.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
        <p className="text-gray-500">Start by typing your thoughts or feelings above</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Current Session</h2>
          <span className="text-sm text-gray-500">({currentMessages.length} messages)</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={startNewSession}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Session</span>
          </button>
          <button
            onClick={clearCurrentSession}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto space-y-4">
        {currentMessages.map((message) => (
          <EmotionResponse key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;