import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import ChatPage from './pages/ChatPage';
import HistoryPage from './pages/HistoryPage';
import Dashboard from './pages/Dashboard';
import "./index.css";
import './App.css'; // Import Tailwind CSS styles
import keycloak from './utils/keycloak';
import SignUp from './pages/SignUp';
function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) {

    keycloak.init({ onLoad: 'check-sso' }).then(auth => {
      setAuthenticated(auth);
      setInitialized(true);
      if (auth) {
        navigate('/chat'); // Redirect to chat if authenticated
      } else {
        navigate('/'); // Stay on Dashboard if not authenticated
      }
    });
  }
  }, [navigate]);

  if (!initialized) {
    return <div>Loading Keycloak...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
