import React, { useEffect, useState, useMemo } from 'react';
import { format, isToday, parseISO, differenceInMinutes } from 'date-fns';
import { pl } from 'date-fns/locale';

const LiveClockWithUpcomingAppointments = ({ appointments, selectedDate, onChangeView }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const todayAppointments = useMemo(() => {
    return appointments
      .filter(app => isToday(parseISO(app.date)))
      .map(app => {
        const start = new Date(app.date);
        const [hours, minutes] = app.time.split(':').map(Number);
        start.setHours(hours, minutes, 0, 0);
        return { ...app, start };
      })
      .filter(app => differenceInMinutes(app.start, currentTime) >= 0)
      .sort((a, b) => a.start - b.start);
  }, [appointments, currentTime]);

  return (
    <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>
          ⏰ {format(currentTime, 'HH:mm')} - Dzisiaj
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onChangeView('day')}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Dzień
          </button>
          <button
            onClick={() => onChangeView('week')}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Tydzień
          </button>
          <button
            onClick={() => onChangeView('month')}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Miesiąc
          </button>
        </div>
      </div>
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Nadchodzące wizyty:
        </h4>
        {todayAppointments.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>Brak zaplanowanych wizyt.</p>
        ) : (
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            maxHeight: '200px', 
            overflowY: 'auto' 
          }}>
            {todayAppointments.map(app => (
              <li 
                key={app.id} 
                style={{
                  border: '1px solid #dee2e6',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#007bff' }}>
                  {format(app.start, 'HH:mm')} - {app.clientName}
                </div>
                {app.description && (
                  <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.25rem' }}>
                    {app.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LiveClockWithUpcomingAppointments; 