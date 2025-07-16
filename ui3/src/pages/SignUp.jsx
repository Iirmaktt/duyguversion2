import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import keycloak from '../utils/keycloak';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', formData);
      alert('Kayıt başarılı!');
      keycloak.login();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Kayıt başarısız.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-6 bg-gradient-to-br from-[#cce7ff] to-[#ffe0f0]">
      <h2 className="text-4xl font-bold mb-6 font-serif text-purple-800">✍️ Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 bg-white p-8 rounded-xl shadow-2xl">
        <input
          type="text"
          name="username"
          placeholder="Kullanıcı Adı"
          required
          value={formData.username}
          onChange={handleChange}
          className="border p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          required
          value={formData.password}
          onChange={handleChange}
          className="border p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-6 py-3 rounded shadow-lg transition-colors"
        >
          Kayıt Ol
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded shadow-lg transition-colors"
        >
          Ana Sayfaya Dön
        </button>
      </form>
    </div>
  );
}
