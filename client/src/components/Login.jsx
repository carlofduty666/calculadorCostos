import React, { useState } from 'react';
import axios from 'axios';
import { HiOutlineLockClosed, HiOutlineUser, HiOutlineArrowRight, HiOutlineExclamationCircle, HiOutlineShieldCheck } from 'react-icons/hi2';
import '../styles/Auth.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      localStorage.setItem('token', response.data.token);
      onLogin(response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Error en el login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>
          <HiOutlineLockClosed size={32} />
          Administrador
        </h1>
        <p className="subtitle">Acceso privado al calculador de costos</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              <HiOutlineUser size={14} style={{ display: 'inline-block', marginRight: '6px' }} />
              Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <HiOutlineLockClosed size={14} style={{ display: 'inline-block', marginRight: '6px' }} />
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <HiOutlineExclamationCircle size={18} />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar Sesión
                <HiOutlineArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tienes acceso?</p>
          <a href="/">Volver al calculador</a>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}