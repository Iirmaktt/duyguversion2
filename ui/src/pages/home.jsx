import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
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
      console.error("API HATASI:", error.message);
    }
  };

  const goToHistory = () => {
    navigate('/history');
  };

  return (
    <div>
      <h2>🧠 Duygu Analizli Chat</h2>

      <div>
        {chat.map((msg, index) => (
          <div key={index}>
            <p><strong>Sen:</strong> {msg.text}</p>
            <p><em>Duygu:</em> {msg.sentiment}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Mesaj yaz..."
      />
      <button onClick={handleSend}>Gönder</button>

      <button onClick={goToHistory}>
        🕓 Geçmişi Göster
      </button>
    </div>
  );
}

export default Home;
