import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChatPage() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const navigate = useNavigate();

  // ✅ Mesajı backend'e gönder
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
      console.error("API HATASI:", error.message);
    }
  };

  // /history sayfasına git
  const handleShowHistory = () => {
    navigate('/history');
  };

  return (
    <div style={{
      maxWidth: '700px',
      margin: '40px auto',
      padding: '30px',
      borderRadius: '12px',
      background: '#ffffff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333'
      }}>
        🧠 Duygu Analizli Chat
      </h2>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        height: '350px',
        overflowY: 'auto',
        background: '#fafafa',
        marginBottom: '25px'
      }}>
        {chat.length === 0 && (
          <p style={{ color: '#777', textAlign: 'center' }}>Henüz mesaj yok.</p>
        )}
        {chat.map((msg, index) => (
          <div key={index} style={{
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}>
            <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>Sen: {msg.text}</p>
            <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>Duygu: {msg.sentiment}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..."
          style={{
            flex: '1',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: '#4a90e2',
            color: '#fff',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
          onMouseOver={e => e.target.style.backgroundColor = '#3a78c2'}
          onMouseOut={e => e.target.style.backgroundColor = '#4a90e2'}
        >
          Gönder
        </button>
      </div>

      <button
        onClick={handleShowHistory}
        style={{
          display: 'block',
          width: '100%',
          padding: '12px 0',
          borderRadius: '8px',
          backgroundColor: '#4a90e2',
          color: '#fff',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background 0.3s'
        }}
        onMouseOver={e => e.target.style.backgroundColor = '#3a78c2'}
        onMouseOut={e => e.target.style.backgroundColor = '#4a90e2'}
      >
        🕓 Geçmişi Göster
      </button>
    </div>
  );
}

export default ChatPage;
