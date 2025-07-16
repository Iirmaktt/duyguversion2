import React from 'react';
import { useNavigate } from 'react-router-dom';
import keycloak from '../utils/keycloak';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md shadow-md fixed top-0 left-0 z-50">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-purple-800 font-serif">
        Duygu-Analiz
      </h1>

      {/* Sağ Butonlar */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/signup')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow transition transform hover:scale-105"
        >
          Sign Up
        </button>
        <button
          onClick={() => keycloak.login()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow transition transform hover:scale-105"
        >
          Login
        </button>
      </div>
    </nav>
  );
}
