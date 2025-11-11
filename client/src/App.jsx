import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import Calculator from './components/Calculator';
import './App.css';

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const handleLogin = (authToken) => {
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Ruta protegida para admin
  const ProtectedAdminRoute = ({ element }) => {
    return token ? element : <Navigate to="/admin/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Calculador público */}
        <Route path="/" element={<Calculator />} />

        {/* Login */}
        <Route
          path="/admin/login"
          element={token ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />}
        />

        {/* Panel de admin protegido */}
        <Route
          path="/admin"
          element={
            token ? (
              <AdminPanel token={token} onLogout={handleLogout} />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />

        {/* Redirect por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;