/*import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    console.log("BUTONA BASILDI");

    try {
      const res = await axios.post('http://localhost:5000/analyze', {
        message: input
      });

      console.log("GELEN CEVAP:", res.data);

      const sentiment =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '❓ Cevap alınamadı';

      setChat([...chat, { text: input, sentiment }]);
      setInput('');
    } catch (error) {
      console.error("API HATASI:", error.message);
    }
  };

  const getHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/messages');
      setHistory(res.data);
    } catch (error) {
      console.error("Geçmiş alınamadı:", error.message);
    }
  };

  return (
    <div className="chat-container">
      <h2>🧠 Duygu Analizli Chat</h2>

      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className="chat-message">
            <p><strong>Sen:</strong> {msg.text}</p>
            <p><em>Duygu:</em> {msg.sentiment}</p>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesaj yaz..."
        />
        <button onClick={handleSend}>Gönder</button>
      </div>

      <button onClick={getHistory} className="history-button">🕓 Geçmişi Göster</button>

      <div className="chat-history">
        {history.map((msg, index) => (
          <div key={index} className="chat-message">
            <p><strong>Sen:</strong> {msg.message}</p>
            <p><em>Duygu:</em> {msg.sentiment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
*/




/*

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    console.log("BUTONA BASILDI");

    try {
      const res = await axios.post('http://localhost:5000/analyze', {
        message: input,
        user_id: 1  // sabit id gönderiyoruz örnek olarak
      });

      console.log("GELEN CEVAP:", res.data);

      const sentiment =
        res.data?.sentiment || '❓ Cevap alınamadı';

      setChat(prev => [...prev, { text: input, sentiment }]);
      setInput('');
    } catch (error) {
      console.error("API HATASI:", error.message);
    }
  };

  const getHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/messages');
      console.log("GEÇMİŞ VERİSİ:", res.data);
      setHistory(res.data);
    } catch (error) {
      console.error("Geçmiş alınamadı:", error.message);
    }
  };

  return (
    <div className="chat-container">
      <h2>🧠 Duygu Analizli Chat</h2>

      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className="chat-message">
            <p><strong>Sen:</strong> {msg.text}</p>
            <p><em>Duygu:</em> {msg.sentiment}</p>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesaj yaz..."
        />
        <button onClick={handleSend}>Gönder</button>
      </div>

      <button
        onClick={getHistory}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        🕓 Geçmişi Göster
      </button>

      <div className="chat-history">
        {history.map((msg, index) => (
          <div key={index} className="chat-message">
            <p><strong>Sen:</strong> {msg.message}</p>
            <p><em>Duygu:</em> {msg.sentiment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


*/




/*

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './ChatPage';
import HistoryPage from './HistoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
*/



import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import Login from './Login';
import SignUp from './SignUp';
import ChatPage from './ChatPage';
import HistoryPage from './HistoryPage';
import "./index.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
