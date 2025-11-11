import React, { useState } from 'react';
import axios from 'axios';
import { HiOutlineXMark, HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi2';
import '../styles/AppointmentModal.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AppointmentModal({ isOpen, onClose, selectedItems, total }) {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    appointment_date: '',
    appointment_time: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.client_name || !formData.client_email || !formData.appointment_date || !formData.appointment_time) {
      setError('Por favor completa los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const appointmentData = {
        ...formData,
        items: selectedItems,
        total: total.total,
      };

      const response = await axios.post(`${API_URL}/appointments`, appointmentData);
      
      setSuccess('¡Cita agendada exitosamente!');
      setTimeout(() => {
        setFormData({
          client_name: '',
          client_email: '',
          client_phone: '',
          appointment_date: '',
          appointment_time: '',
          notes: '',
        });
        setSuccess('');
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agendar Cita</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            <HiOutlineXMark size={24} />
          </button>
        </div>

        {error && (
          <div className="modal-alert alert-error">
            <HiOutlineExclamationCircle size={18} />
            {error}
          </div>
        )}
        {success && (
          <div className="modal-alert alert-success">
            <HiOutlineCheckCircle size={18} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="client_name">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="client_email">
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="client_email"
              name="client_email"
              value={formData.client_email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="client_phone">
              Teléfono
            </label>
            <input
              type="tel"
              id="client_phone"
              name="client_phone"
              value={formData.client_phone}
              onChange={handleChange}
              placeholder="+58 414 XXX XXXX"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointment_date">
                Fecha *
              </label>
              <input
                type="date"
                id="appointment_date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointment_time">
                Hora *
              </label>
              <input
                type="time"
                id="appointment_time"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              Notas Adicionales
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Descripciones o requerimientos especiales..."
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="modal-summary">
            <h3>Resumen de la Cita</h3>
            <div className="summary-items">
              {selectedItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>{item.nombre}</span>
                  <span>${item.precio.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span className="amount">${total.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Agendando...' : 'Confirmar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
