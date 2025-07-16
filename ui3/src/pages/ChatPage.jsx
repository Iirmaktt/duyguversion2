import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import keycloak from '../utils/keycloak';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const res = await axios.post('http://localhost:5000/analyze', {
        message: input,
        user_id: 1
      });

      const sentiment = res.data?.sentiment || '❓ Cevap alınamadı';
      setChat(prev => [...prev, { text: input, sentiment }]);
      setInput('');
    } catch (error) {
      console.error('API HATASI:', error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 rounded-2xl bg-white shadow-lg font-sans">
      <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
        🧠 Duygu Analizli Chat
      </h2>

      <div className="border border-gray-200 rounded-lg p-4 h-80 overflow-y-auto bg-gray-50 mb-6">
        {chat.length === 0 && (
          <p className="text-gray-500 text-center italic">Henüz mesaj yok.</p>
        )}
        {chat.map((msg, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-lg p-4 mb-4 shadow-sm"
          >
            <p className="mb-1 text-gray-800">
              <span className="font-semibold">Sen:</span>{' '}
              <span className="font-bold">{msg.text}</span>
            </p>
            <p className="italic text-gray-700">Duygu: {msg.sentiment}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold text-black"
        />
        <button
          onClick={handleSend}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Gönder
        </button>
      </div>

      <button
        onClick={() => navigate('/history')}
        className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        🕓 Geçmişi Göster
      </button>

      <button
        onClick={() => keycloak.logout({ redirectUri: 'http://localhost:5173/' })}
        className="mt-4 w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>

    </div>
  );
}
