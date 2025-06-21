import React, { useState, useEffect } from 'react';
import { isAdmin } from '../services/userService';

export default function AppointmentScheduler({ 
  currentUser, 
  clients, 
  handleAddAppointment,
  handleUpdateAppointment,
  handleDeleteAppointment,
  getUserAppointments,
  getUpcomingUserAppointments
}) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClient, setSelectedClient] = useState('');
  const [formData, setFormData] = useState({
    date: selectedDate,
    time: '',
    duration: 60,
    description: '',
    status: 'confirmed'
  });
  const [currentTime, setCurrentTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );

  // Aktualizuj czas co minutę
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toTimeString().slice(0, 5));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Aktualizuj formData gdy zmienia się data
  useEffect(() => {
    setFormData(prev => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

  // Filtruj klientów według roli użytkownika
  const filteredClients = isAdmin(currentUser) 
    ? clients 
    : clients.filter(client => client.ownerId === currentUser?.id);

  // Pobierz wizyty dla wybranej daty
  const dayAppointments = getUserAppointments(currentUser?.id)
    .filter(apt => apt.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Pobierz nadchodzące wizyty
  const upcomingAppointments = getUpcomingUserAppointments(currentUser?.id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedClient) {
      alert('Wybierz klienta!');
      return;
    }

    handleAddAppointment(selectedClient, formData);
    
    // Resetuj formularz
    setFormData({
      date: selectedDate,
      time: '',
      duration: 60,
      description: '',
      status: 'confirmed'
    });
    setSelectedClient('');
  };

  const handleDeleteAppointmentLocal = (clientId, appointmentId) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę wizytę?')) {
      handleDeleteAppointment(clientId, appointmentId);
    }
  };

  // Generuj sloty czasowe od 8:00 do 20:00
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>📅 Harmonogram Wizyt - {new Date(selectedDate).toLocaleDateString('pl-PL')}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1rem' }}>
          
          {/* Kalendarz dzienny */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Harmonogram dzienny</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span>🕒 {currentTime}</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ padding: '0.25rem', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateRows: 'repeat(25, 1fr)', 
              gap: '1px', 
              border: '1px solid #dee2e6',
              maxHeight: '600px',
              overflow: 'auto'
            }}>
              {timeSlots.map((timeSlot, index) => {
                const appointment = dayAppointments.find(apt => apt.time === timeSlot);
                const isPast = timeSlot < currentTime && selectedDate === new Date().toISOString().split('T')[0];
                
                return (
                  <div
                    key={index}
                    style={{
                      padding: '0.5rem',
                      borderBottom: '1px solid #dee2e6',
                      backgroundColor: isPast ? '#f8f9fa' : 'white',
                      position: 'relative',
                      minHeight: '40px'
                    }}
                  >
                    <span style={{ 
                      position: 'absolute', 
                      left: '0.5rem', 
                      top: '0.5rem',
                      fontSize: '0.8rem',
                      color: '#6c757d',
                      fontWeight: 'bold'
                    }}>
                      {timeSlot}
                    </span>
                    
                    {appointment && (
                      <div style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        marginLeft: '3rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>{appointment.clientName}</span>
                        <button
                          onClick={() => handleDeleteAppointmentLocal(appointment.clientId, appointment.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.7rem'
                          }}
                        >
                          ❌
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel boczny */}
          <div className="card">
            <h3>➕ Dodaj wizytę</h3>
            
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Klient:</label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="">Wybierz klienta</option>
                  {filteredClients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Data:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Godzina:</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Czas trwania (min):</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value={30}>30 min</option>
                  <option value={60}>1 godz</option>
                  <option value={90}>1.5 godz</option>
                  <option value={120}>2 godz</option>
                </select>
              </div>

              <div className="form-group">
                <label>Opis:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Opis wizyty..."
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '60px' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Dodaj wizytę
              </button>
            </form>

            {/* Nadchodzące wizyty */}
            <div style={{ marginTop: '2rem' }}>
              <h4>🎯 Nadchodzące wizyty</h4>
              {upcomingAppointments.length === 0 ? (
                <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>Brak zaplanowanych wizyt.</p>
              ) : (
                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {upcomingAppointments.slice(0, 10).map(appointment => (
                    <div
                      key={appointment.id}
                      style={{
                        padding: '0.5rem',
                        borderBottom: '1px solid #eee',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{appointment.clientName}</div>
                      <div style={{ color: '#6c757d' }}>
                        {new Date(appointment.date).toLocaleDateString('pl-PL')} o {appointment.time}
                      </div>
                      {appointment.description && (
                        <div style={{ fontSize: '0.7rem', color: '#999' }}>
                          {appointment.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 