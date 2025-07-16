import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Message, EmotionSession } from '../types/emotion';
import { emotionAPI } from '../services/emotionAPI';

interface EmotionStore {
  // Current session
  currentSessionId: string;
  currentMessages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // History
  allMessages: Message[];
  sessions: EmotionSession[];
  
  // Actions
  startNewSession: () => void;
  analyzeEmotion: (text: string) => Promise<void>;
  clearCurrentSession: () => void;
  clearAllHistory: () => void;
  getMessagesForSession: (sessionId: string) => Message[];
  getCurrentSession: () => EmotionSession | undefined;
}

export const useEmotionStore = create<EmotionStore>()(
  persist(
    (set, get) => ({
      currentSessionId: uuidv4(),
      currentMessages: [],
      isLoading: false,
      error: null,
      allMessages: [],
      sessions: [],

      startNewSession: () => {
        const newSessionId = uuidv4();
        const currentSession = get().getCurrentSession();
        
        if (currentSession && get().currentMessages.length > 0) {
          // Update the current session end time
          set((state) => ({
            sessions: state.sessions.map(session => 
              session.id === currentSession.id 
                ? { ...session, endTime: Date.now() }
                : session
            )
          }));
        }
        
        set({
          currentSessionId: newSessionId,
          currentMessages: [],
          error: null
        });
      },

      analyzeEmotion: async (text: string) => {
        if (!text.trim()) return;
        
        const messageId = uuidv4();
        const currentSessionId = get().currentSessionId;
        
        // Create loading message
        const loadingMessage: Message = {
          id: messageId,
          sessionId: currentSessionId,
          timestamp: Date.now(),
          userInput: text,
          emotionAnalysis: {
            emotion: 'analyzing',
            confidence: 0,
            intensity: 'low',
            color: '#6B7280'
          },
          isLoading: true
        };
        
        set((state) => ({
          currentMessages: [...state.currentMessages, loadingMessage],
          isLoading: true,
          error: null
        }));
        
        try {
          const emotionResult = await emotionAPI.analyzeEmotion(text);
          
          const completedMessage: Message = {
            ...loadingMessage,
            emotionAnalysis: emotionResult,
            isLoading: false
          };
          
          set((state) => {
            const updatedCurrentMessages = state.currentMessages.map(msg => 
              msg.id === messageId ? completedMessage : msg
            );
            
            const updatedAllMessages = [...state.allMessages.filter(msg => msg.id !== messageId), completedMessage];
            
            // Update or create session
            let updatedSessions = [...state.sessions];
            const existingSessionIndex = updatedSessions.findIndex(s => s.id === currentSessionId);
            
            if (existingSessionIndex >= 0) {
              updatedSessions[existingSessionIndex] = {
                ...updatedSessions[existingSessionIndex],
                messageCount: updatedSessions[existingSessionIndex].messageCount + 1,
                dominantEmotion: emotionResult.emotion
              };
            } else {
              updatedSessions.push({
                id: currentSessionId,
                startTime: Date.now(),
                messageCount: 1,
                dominantEmotion: emotionResult.emotion
              });
            }
            
            return {
              currentMessages: updatedCurrentMessages,
              allMessages: updatedAllMessages,
              sessions: updatedSessions,
              isLoading: false
            };
          });
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to analyze emotion';
          
          set((state) => ({
            currentMessages: state.currentMessages.map(msg => 
              msg.id === messageId 
                ? { ...msg, isLoading: false, error: errorMessage }
                : msg
            ),
            isLoading: false,
            error: errorMessage
          }));
        }
      },

      clearCurrentSession: () => {
        set({
          currentMessages: [],
          error: null
        });
      },

      clearAllHistory: () => {
        set({
          allMessages: [],
          sessions: [],
          currentMessages: [],
          error: null
        });
      },

      getMessagesForSession: (sessionId: string) => {
        return get().allMessages.filter(msg => msg.sessionId === sessionId);
      },

      getCurrentSession: () => {
        const currentSessionId = get().currentSessionId;
        return get().sessions.find(session => session.id === currentSessionId);
      }
    }),
    {
      name: 'emotion-analysis-storage',
      partialize: (state) => ({
        allMessages: state.allMessages,
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
        currentMessages: state.currentMessages
      })
    }
  )
);