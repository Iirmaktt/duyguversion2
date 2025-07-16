import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, History, Sparkles } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EmotionAI
              </h1>
              <p className="text-xs text-gray-500">Analyze your emotions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Analyze</span>
            </Link>
            
            <Link
              to="/history"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                location.pathname === '/history' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="font-medium">History</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;