import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HiOutlineArrowRightOnRectangle, HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineCheckCircle, HiOutlineXMark, HiOutlineExclamationCircle, HiOutlineListBullet, HiOutlineCurrencyDollar, HiOutlineSparkles } from 'react-icons/hi2';
import '../styles/AdminPanel.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminPanel({ token, onLogout }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state para nuevo item
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
  });

  // State para editar
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/items`);
      // Convertir precio a número
      const itemsWithNumbers = response.data.map(item => ({
        ...item,
        precio: parseFloat(item.precio)
      }));
      setItems(itemsWithNumbers);
      setError('');
    } catch (err) {
      setError('Error cargando servicios');
    } finally {
      setLoading(false);
    }
  };

  // Agregar nuevo item
  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio) {
      setError('Nombre y precio son requeridos');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/items`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems([...items, response.data]);
      setFormData({ nombre: '', precio: '', descripcion: '' });
      setSuccess('Servicio agregado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agregar servicio');
    } finally {
      setLoading(false);
    }
  };

  // Iniciar edición
  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  // Guardar cambios
  const handleSaveEdit = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/items/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.map((item) => (item.id === id ? response.data : item)));
      setEditingId(null);
      setSuccess('Servicio actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar servicio');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Eliminar item
  const handleDeleteItem = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item.id !== id));
      setSuccess('Servicio eliminado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>
          <HiOutlineListBullet size={28} />
          Panel de Administración
        </h1>
        <button onClick={onLogout} className="btn-logout" title="Cerrar sesión">
          <HiOutlineArrowRightOnRectangle size={18} />
          Cerrar Sesión
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <HiOutlineExclamationCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <HiOutlineCheckCircle size={18} />
          {success}
        </div>
      )}

      <div className="admin-content">
        <div className="admin-columns">
          <div className="services-column">
            <div className="add-item-section">
              <h2>
                <HiOutlineSparkles size={22} />
                Agregar Nuevo Servicio
              </h2>
              <form onSubmit={handleAddItem}>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <HiOutlineListBullet size={14} style={{ display: 'inline-block', marginRight: '4px', marginBottom: '-2px' }} />
                      Nombre Servicio *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      placeholder="Ej: Consultoría"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <HiOutlineCurrencyDollar size={14} style={{ display: 'inline-block', marginRight: '4px', marginBottom: '-2px' }} />
                      Precio *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) =>
                        setFormData({ ...formData, precio: parseFloat(e.target.value) })
                      }
                      placeholder="0.00"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción</label>
                    <input
                      type="text"
                      value={formData.descripcion}
                      onChange={(e) =>
                        setFormData({ ...formData, descripcion: e.target.value })
                      }
                      placeholder="Descripción opcional"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-add"
                    title="Agregar nuevo servicio"
                  >
                    <HiOutlinePlus size={18} />
                    Agregar
                  </button>
                </div>
              </form>
            </div>

            <div className="items-section">
              <h2>
                <HiOutlineListBullet size={22} />
                Servicios Existentes ({items.length})
              </h2>
              {loading && items.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 20px' }}>
                  Cargando servicios...
                </p>
              ) : items.length === 0 ? (
                <p className="empty-message">No hay servicios aún. ¡Agrega uno para comenzar!</p>
              ) : (
                <div className="items-table">
                  {items.map((item) =>
                    editingId === item.id ? (
                      <div key={item.id} className="item-row editing">
                        <div className="item-field">
                          <label>Nombre</label>
                          <input
                            type="text"
                            value={editData.nombre}
                            onChange={(e) =>
                              setEditData({ ...editData, nombre: e.target.value })
                            }
                          />
                        </div>
                        <div className="item-field">
                          <label>Precio</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editData.precio}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                precio: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="item-field">
                          <label>Descripción</label>
                          <input
                            type="text"
                            value={editData.descripcion || ''}
                            onChange={(e) =>
                              setEditData({ ...editData, descripcion: e.target.value })
                            }
                          />
                        </div>
                        <div className="item-actions">
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="btn-save"
                            disabled={loading}
                            title="Guardar cambios"
                          >
                            <HiOutlineCheckCircle size={16} />
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="btn-cancel"
                            disabled={loading}
                            title="Cancelar edición"
                          >
                            <HiOutlineXMark size={16} />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        key={item.id} 
                        className="item-row"
                        onMouseEnter={playHoverSound}
                      >
                        <div className="item-info">
                          <h3>{item.nombre}</h3>
                          <p className="price">
                            <HiOutlineCurrencyDollar size={16} style={{ display: 'inline-block', marginRight: '4px', marginBottom: '-2px' }} />
                            {item.precio.toFixed(2)}
                          </p>
                          {item.descripcion && (
                            <p className="description">{item.descripcion}</p>
                          )}
                        </div>
                        <div className="item-actions">
                          <button
                            onClick={() => {
                              playClickSound();
                              handleStartEdit(item);
                            }}
                            className="btn-edit"
                            disabled={loading}
                            title="Editar servicio"
                          >
                            <HiOutlinePencilSquare size={16} />
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              playClickSound();
                              handleDeleteItem(item.id);
                            }}
                            className="btn-delete"
                            disabled={loading}
                            title="Eliminar servicio"
                          >
                            <HiOutlineTrash size={16} />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}