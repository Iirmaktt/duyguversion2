import React, { useState, useMemo } from 'react';
import { useEmotionStore } from '../store/emotionStore';
import { format } from 'date-fns';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  BarChart3, 
  Trash2, 
  MessageSquare,
  Clock,
  TrendingUp
} from 'lucide-react';

const HistoryPage: React.FC = () => {
  const { allMessages, sessions, clearAllHistory } = useEmotionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [selectedSession, setSelectedSession] = useState('all');

  const filteredMessages = useMemo(() => {
    return allMessages.filter(message => {
      const matchesSearch = message.userInput.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEmotion = selectedEmotion === 'all' || message.emotionAnalysis.emotion === selectedEmotion;
      const matchesSession = selectedSession === 'all' || message.sessionId === selectedSession;
      return matchesSearch && matchesEmotion && matchesSession;
    });
  }, [allMessages, searchTerm, selectedEmotion, selectedSession]);

  const emotionStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    allMessages.forEach(message => {
      const emotion = message.emotionAnalysis.emotion;
      stats[emotion] = (stats[emotion] || 0) + 1;
    });
    return Object.entries(stats).sort(([,a], [,b]) => b - a);
  }, [allMessages]);

  const uniqueEmotions = useMemo(() => {
    const emotions = new Set(allMessages.map(msg => msg.emotionAnalysis.emotion));
    return Array.from(emotions);
  }, [allMessages]);

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
      neutral: '😐'
    };
    return emojiMap[emotion] || '😐';
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };

  const formatSessionDate = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy');
  };

  if (allMessages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No History Yet</h2>
          <p className="text-gray-500 mb-6">Start analyzing emotions to see your history here</p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Start Analyzing</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <History className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Emotion History</h1>
              <p className="text-gray-500">Track your emotional journey over time</p>
            </div>
          </div>
          <button
            onClick={clearAllHistory}
            className="inline-flex items-center space-x-2 px-4 py-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All History</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Total Messages</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{allMessages.length}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Sessions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Most Common</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 capitalize">
              {emotionStats[0] ? (
                <span className="flex items-center space-x-1">
                  <span>{getEmotionEmoji(emotionStats[0][0])}</span>
                  <span>{emotionStats[0][0]}</span>
                </span>
              ) : 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedEmotion}
            onChange={(e) => setSelectedEmotion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Emotions</option>
            {uniqueEmotions.map(emotion => (
              <option key={emotion} value={emotion} className="capitalize">
                {getEmotionEmoji(emotion)} {emotion}
              </option>
            ))}
          </select>
          
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Sessions</option>
            {sessions.map(session => (
              <option key={session.id} value={session.id}>
                {formatSessionDate(session.startTime)} ({session.messageCount} messages)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Emotion Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Emotion Distribution</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {emotionStats.map(([emotion, count]) => (
            <div key={emotion} className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-1">{getEmotionEmoji(emotion)}</div>
              <div className="text-sm font-medium text-gray-900 capitalize">{emotion}</div>
              <div className="text-xs text-gray-500">{count} messages</div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Messages ({filteredMessages.length})</span>
          </h2>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No messages match your current filters
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: message.emotionAnalysis.color }}
                      >
                        {getEmotionEmoji(message.emotionAnalysis.emotion)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {message.emotionAnalysis.emotion}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(message.emotionAnalysis.confidence * 100)}% confidence
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(message.timestamp)}</span>
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {message.userInput}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;