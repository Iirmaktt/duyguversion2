import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const pageSize = 30;

  useEffect(() => {
    const getHistory = async () => {
      const res = await axios.get('http://localhost:5000/messages');
      setHistory(res.data);
    };
    getHistory();
  }, []);

  const totalPages = Math.max(Math.ceil(history.length / pageSize), 1);

  const startIndex = (currentPage - 1) * pageSize;
  const currentMessages = history.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleGoBack = () => {
    navigate('/chat'); // Chat sayfasına yönlendir
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#000' }}>
        🕓 Geçmiş Mesajlar
      </h2>

      {currentMessages.length === 0 && (
        <p style={{ textAlign: 'center', color: '#000' }}>
          Henüz kayıtlı mesaj yok.
        </p>
      )}

      {currentMessages.map((msg, index) => (
        <div
          key={index}
          style={{
            background: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: '#000'
          }}
        >
          <p><strong>Sen:</strong> {msg.message}</p>
          <p><em>Duygu:</em> {msg.sentiment}</p>
        </div>
      ))}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px',
          color: '#000'
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          style={{
            padding: '8px 16px',
            borderRadius: '5px',
            backgroundColor: '#4a90e2',
            color: '#fff',
            border: 'none',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          ◀ Önceki Sayfa
        </button>

        <span style={{ alignSelf: 'center', color: '#000' }}>
          Sayfa {currentPage} / {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 16px',
            borderRadius: '5px',
            backgroundColor: '#4a90e2',
            color: '#fff',
            border: 'none',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          Sonraki Sayfa ▶
        </button>
      </div>

      <button
        onClick={handleGoBack}
        style={{
          display: 'block',
          margin: '0 auto',
          padding: '10px 20px',
          borderRadius: '5px',
          backgroundColor: '#777',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        🔙 Chat Sayfasına Dön
      </button>
    </div>
  );
}

export default HistoryPage;
