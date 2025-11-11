import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineCheckCircle, HiOutlineXMark, HiOutlineExclamationCircle, HiOutlineCalendarDays, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi2';
import '../styles/AppointmentsManager.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AppointmentsManager({ token }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
      setError('');
    } catch (err) {
      setError('Error cargando citas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (appointment) => {
    setEditingId(appointment.id);
    setEditData({ ...appointment });
  };

  const handleSaveEdit = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/appointments/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.map((apt) => (apt.id === id ? { ...editData, id } : apt)));
      setEditingId(null);
      setSuccess('Cita actualizada correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar cita');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((apt) => apt.id !== id));
      setSuccess('Cita eliminada correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar cita');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmada':
        return 'status-confirmed';
      case 'completada':
        return 'status-completed';
      case 'cancelada':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="appointments-section">
      <h2>
        <HiOutlineCalendarDays size={22} />
        Citas Agendadas ({appointments.length})
      </h2>

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

      {loading && appointments.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 20px' }}>
          Cargando citas...
        </p>
      ) : appointments.length === 0 ? (
        <p className="empty-message">No hay citas aún.</p>
      ) : (
        <div className="appointments-table">
          {appointments.map((appointment) =>
            editingId === appointment.id ? (
              <div key={appointment.id} className="appointment-row editing">
                <div className="appointment-field">
                  <label>Nombre Cliente</label>
                  <input
                    type="text"
                    value={editData.client_name}
                    onChange={(e) => setEditData({ ...editData, client_name: e.target.value })}
                  />
                </div>
                <div className="appointment-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editData.client_email}
                    onChange={(e) => setEditData({ ...editData, client_email: e.target.value })}
                  />
                </div>
                <div className="appointment-field">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={editData.client_phone || ''}
                    onChange={(e) => setEditData({ ...editData, client_phone: e.target.value })}
                  />
                </div>
                <div className="appointment-field">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={editData.appointment_date}
                    onChange={(e) => setEditData({ ...editData, appointment_date: e.target.value })}
                  />
                </div>
                <div className="appointment-field">
                  <label>Hora</label>
                  <input
                    type="time"
                    value={editData.appointment_time}
                    onChange={(e) => setEditData({ ...editData, appointment_time: e.target.value })}
                  />
                </div>
                <div className="appointment-field">
                  <label>Estado</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div className="appointment-actions">
                  <button
                    onClick={() => handleSaveEdit(appointment.id)}
                    className="btn-save"
                    disabled={loading}
                  >
                    <HiOutlineCheckCircle size={16} />
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="btn-cancel"
                    disabled={loading}
                  >
                    <HiOutlineXMark size={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div key={appointment.id} className="appointment-row">
                <div className="appointment-info">
                  <h3>{appointment.client_name}</h3>
                  <p className="email">{appointment.client_email}</p>
                  <p className="phone">{appointment.client_phone || '-'}</p>
                  <div className="appointment-datetime">
                    <span>{formatDate(appointment.appointment_date)}</span>
                    <span>{appointment.appointment_time}</span>
                  </div>
                  <div className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                    {appointment.status}
                  </div>
                </div>
                <div className="appointment-summary">
                  <strong>${appointment.total.toFixed(2)}</strong>
                  <span className="item-count">{appointment.items.length} servicio(s)</span>
                </div>
                <div className="appointment-actions">
                  <button
                    onClick={() => setSelectedAppointment(appointment)}
                    className="btn-view"
                    disabled={loading}
                    title="Ver detalles"
                  >
                    <HiOutlineEye size={16} />
                  </button>
                  <button
                    onClick={() => handleStartEdit(appointment)}
                    className="btn-edit"
                    disabled={loading}
                  >
                    <HiOutlinePencilSquare size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    className="btn-delete"
                    disabled={loading}
                  >
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de la Cita</h2>
              <button className="modal-close" onClick={() => setSelectedAppointment(null)}>
                <HiOutlineXMark size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-group">
                <label>Nombre Cliente</label>
                <p>{selectedAppointment.client_name}</p>
              </div>

              <div className="detail-group">
                <label>Email</label>
                <p>{selectedAppointment.client_email}</p>
              </div>

              <div className="detail-group">
                <label>Teléfono</label>
                <p>{selectedAppointment.client_phone || '-'}</p>
              </div>

              <div className="detail-group">
                <label>Fecha y Hora</label>
                <p>{formatDate(selectedAppointment.appointment_date)} a las {selectedAppointment.appointment_time}</p>
              </div>

              <div className="detail-group">
                <label>Estado</label>
                <p>
                  <span className={`status-badge ${getStatusBadgeClass(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </p>
              </div>

              <div className="detail-group">
                <label>Servicios</label>
                <div className="services-list">
                  {selectedAppointment.items.map((item, index) => (
                    <div key={index} className="service-item">
                      <span>{item.nombre}</span>
                      <span>${item.precio.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-group">
                <label>Total</label>
                <p className="total-amount">${selectedAppointment.total.toFixed(2)}</p>
              </div>

              {selectedAppointment.notes && (
                <div className="detail-group">
                  <label>Notas</label>
                  <p>{selectedAppointment.notes}</p>
                </div>
              )}

              <button className="btn-close" onClick={() => setSelectedAppointment(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
