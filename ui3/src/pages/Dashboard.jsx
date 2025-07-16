import React from 'react';
import { useNavigate } from 'react-router-dom';
import keycloak from '../utils/keycloak';
import Navbar from "./Navbar";
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#cce7ff] to-[#ffe0f0]">
      <Navbar />

      <div className="flex flex-col items-center text-center gap-6 mt-28">
        {/* Başlık */}
        <h1 className="text-5xl font-extrabold font-serif text-purple-800 tracking-wide">
          Duygu-Analiz
        </h1>
        <p className="text-sm text-gray-500 mb-2">Sentiment Analysis Platformu</p>

        {/* Resim Kartı */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
          <img
            src="/foto2.jpg"
            alt="Sentiment Analysis"
            className="w-80 h-auto rounded-lg"
          />
        </div>

        {/* Açıklama Metni */}
        <p className="text-lg text-gray-700">
          Duygu analizi uygulamasına hoş geldiniz!
        </p>

        <p className="text-md text-gray-600">
          Lütfen aşağıdaki seçeneklerden birini seçin:
        </p>

        {/* Butonlar */}
        <div className="flex flex-row gap-4 mt-4">
          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-md transition transform hover:scale-105"
          >
            <FaUserPlus size={18} />
            Sign Up
          </button>

          <button
            onClick={() => keycloak.login()}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-md transition transform hover:scale-105"
          >
            <FaSignInAlt size={18} />
            Login with Keycloak
          </button>
        </div>
      </div>
    </div>
  );
}
