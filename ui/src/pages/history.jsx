import React, { useEffect, useState } from 'react';
import axios from 'axios';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/messages');
        setHistory(res.data);
      } catch (error) {
        console.error("Geçmiş alınamadı:", error.message);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>🕓 Mesaj Geçmişi</h2>
      {history.map((msg, index) => (
        <div key={index}>
          <p><strong>Sen:</strong> {msg.message}</p>
          <p><em>Duygu:</em> {msg.sentiment}</p>
        </div>
      ))}
    </div>
  );
}

export default History;
