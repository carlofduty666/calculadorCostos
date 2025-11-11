import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HiOutlineShoppingCart, HiOutlineLockClosed, HiOutlineCheckCircle, HiOutlineXMark, HiOutlineArrowRight, HiOutlineCalculator, HiOutlineCurrencyDollar } from 'react-icons/hi2';
import { PiShootingStarLight } from "react-icons/pi";
import { AiOutlineNumber } from "react-icons/ai";
import { LuRefreshCw } from 'react-icons/lu';
import '../styles/Calculator.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Calculator() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({});
  const [total, setTotal] = useState({
    cantidad: 0,
    subtotal: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const hoverSoundRef = useRef(null);
  const clickSoundRef = useRef(null);

  useEffect(() => {
    hoverSoundRef.current = new Audio('/sounds/bubble-hover.mp3');
    clickSoundRef.current = new Audio('/sounds/bubble-click.mp3');
    hoverSoundRef.current.preload = 'auto';
    clickSoundRef.current.preload = 'auto';
  }, []);

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {});
    }
  };

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  // Cargar items
  useEffect(() => {
    fetchItems();
  }, []);

  // Recalcular total cuando cambian las selecciones
  useEffect(() => {
    calculateTotal();
  }, [selected, items]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/items`);
      // Convertir precio a número
      const itemsWithNumbers = response.data.map(item => ({
        ...item,
        precio: parseFloat(item.precio)
      }));
      setItems(itemsWithNumbers);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (itemId) => {
    setSelected((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const calculateTotal = async () => {
    const selectedItems = items.filter((item) => selected[item.id]);

    if (selectedItems.length === 0) {
      setTotal({
        cantidad: 0,
        subtotal: 0,
        total: 0,
      });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/calcular`, {
        items: selectedItems,
      });
      setTotal(response.data);
    } catch (error) {
      console.error('Error calculating total:', error);
    }
  };

  const handleSelectAll = () => {
    if (Object.keys(selected).length === items.length) {
      setSelected({});
    } else {
      const newSelected = {};
      items.forEach((item) => {
        newSelected[item.id] = true;
      });
      setSelected(newSelected);
    }
  };

  const handleClearAll = () => {
    setSelected({});
  };

  if (loading) {
    return (
      <div className="calculator-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
          <div style={{ textAlign: 'center' }}>
            <LuRefreshCw size={48} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', marginBottom: '16px' }} />
            <p>Cargando servicios...</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const handleOpenCalendar = () => {
    if (selectedCount === 0) {
      return;
    }
    window.open('https://calendar.app.google/nFMP74CKUYwwLxpw7', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="calculator-container">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="calculator-header">
        <h1>
          <HiOutlineShoppingCart size={32} style={{ display: 'inline-block', marginRight: '8px' }} />
          Calculador de Costos
        </h1>
        <p className="subtitle">Selecciona los servicios que necesitas</p>
        <a href="/admin" className="link-admin">
          <HiOutlineLockClosed size={18} />
          <HiOutlineArrowRight size={16} />
        </a>
      </div>

      <div className="calculator-content">
        {/* Lista de items */}
        <div className="items-list">
          <div className="list-header">
            <h2>
              <PiShootingStarLight size={24} />
              Servicios Disponibles
            </h2>
            <div className="list-actions">
              <button onClick={handleSelectAll} className="btn-secondary">
                {selectedCount === items.length ? (
                  <>
                    <HiOutlineXMark size={18} />
                    Deseleccionar Todo
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle size={18} />
                    Seleccionar Todo
                  </>
                )}
              </button>
              {selectedCount > 0 && (
                <button onClick={handleClearAll} className="btn-secondary">
                  <LuRefreshCw size={16} />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <div className="items-grid">
            {items.length === 0 ? (
              <p className="no-items">No hay servicios disponibles</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={`item-card ${selected[item.id] ? 'selected' : ''}`}
                  onClick={() => {
                    playClickSound();
                    handleItemChange(item.id);
                  }}
                  onMouseEnter={playHoverSound}
                >
                  <input
                    type="checkbox"
                    checked={selected[item.id] || false}
                    onChange={() => handleItemChange(item.id)}
                  />
                  <div className="item-content">
                    <h3>{item.nombre}</h3>
                    <p className="item-description">{item.descripcion}</p>
                    <div className="item-price">${item.precio.toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resumen y totales */}
        <div className="calculator-summary">
          <div className="summary-card">
            <h2>
              <HiOutlineCalculator size={20} />
              Resumen
            </h2>

            {selectedCount > 0 && (
              <>
                <div className="selected-services">
                  <h3>Servicios Seleccionados:</h3>
                  <ul>
                    {items
                      .filter((item) => selected[item.id])
                      .map((item) => (
                        <li key={item.id}>{item.nombre}</li>
                      ))}
                  </ul>
                </div>

                <div className="summary-divider"></div>
              </>
            )}

            <div className="summary-item">
              <span>
                <AiOutlineNumber size={16} style={{ display: 'inline-block', marginRight: '6px' }} />
                Cantidad:
              </span>
              <strong>{total.cantidad}</strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-item">
              <span>
                <HiOutlineCurrencyDollar size={16} style={{ display: 'inline-block', marginRight: '6px' }} />
                Subtotal:
              </span>
              <strong>${total.subtotal.toFixed(2)}</strong>
            </div>

            <div className="summary-divider"></div>

            <button 
              className="btn-schedule" 
              disabled={selectedCount === 0} 
              title="Agendar cita"
              onClick={handleOpenCalendar}
            >
              <HiOutlineCheckCircle size={18} />
              Agendar Cita
            </button>

            {selectedCount === 0 && (
              <p className="helper-text">Selecciona servicios para ver el total</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}