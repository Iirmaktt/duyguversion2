import React, { useState, useRef, useEffect } from 'react';
import { useEmotionStore } from '../store/emotionStore';
import { Send, Sparkles, Loader2 } from 'lucide-react';

const EmotionAnalyzer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const { analyzeEmotion, isLoading } = useEmotionStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    await analyzeEmotion(inputText.trim());
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  const examplePrompts = [
    "I'm feeling really excited about my new job opportunity!",
    "I'm worried about the upcoming presentation tomorrow.",
    "This rainy weather makes me feel so peaceful and calm.",
    "I'm frustrated with all the traffic on my way to work."
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-xl font-bold">Emotion Analyzer</h2>
        </div>
        <p className="text-purple-100">
          Share your thoughts and feelings, and I'll analyze the emotions behind them
        </p>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="How are you feeling today? Share your thoughts..."
              className="w-full min-h-[100px] max-h-[200px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <span className="text-xs text-gray-400">
                {inputText.length}/1000
              </span>
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="font-medium">Analyze</span>
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Try these examples:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputText(prompt)}
                className="text-left p-3 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionAnalyzer;