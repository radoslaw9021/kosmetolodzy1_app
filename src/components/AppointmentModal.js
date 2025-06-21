import React from 'react';
import { format } from 'date-fns';
import { treatmentTypes } from './TreatmentForm';

const AppointmentModal = ({
    newAppointment,
    setNewAppointment,
    clients,
    onSave,
    onCancel,
    onAddNewClient,
    availableTreatments
}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        setNewAppointment(prev => ({...prev, date: dateValue}));
    };
    
    return (
        <div className="card" style={{
            border: 'none',
            boxShadow: 'none',
            background: 'transparent',
            padding: '1rem'
        }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Dodaj Nową Wizytę</h3>
            <form onSubmit={onSave}>
                <div className="form-group">
                    <label>Klient</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                            name="clientId"
                            value={newAppointment.clientId}
                            onChange={handleChange}
                            className="modern-input"
                            style={{ flexGrow: 1 }}
                            required
                        >
                            <option value="">-- Wybierz klienta --</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.firstName} {client.lastName}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={onAddNewClient}
                            style={{
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                padding: '0 1.5rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                flexShrink: 0
                            }}>
                            + Nowy
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <label>Data</label>
                    <input
                        type="date"
                        name="date"
                        value={newAppointment.date instanceof Date 
                            ? newAppointment.date.toISOString().split('T')[0] 
                            : newAppointment.date || ''}
                        onChange={handleDateChange}
                        className="modern-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Godzina</label>
                    <input
                        type="time"
                        name="time"
                        value={newAppointment.time}
                        onChange={handleChange}
                        className="modern-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Szacowany czas (min)</label>
                    <input
                        type="number"
                        name="duration"
                        value={newAppointment.duration}
                        onChange={handleChange}
                        className="modern-input"
                        required
                    />
                </div>
                 <div className="form-group">
                    <label>Zabieg</label>
                    <select
                        name="treatment"
                        value={newAppointment.treatment}
                        onChange={handleChange}
                        className="modern-input"
                        required
                    >
                        <option value="">-- wybierz --</option>
                        {availableTreatments.map(treatment => (
                           <option key={treatment} value={treatment}>{treatment}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Komentarz do zabiegu</label>
                    <textarea
                        name="description"
                        rows="3"
                        value={newAppointment.description}
                        onChange={handleChange}
                        className="modern-input"
                    ></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="button" onClick={onCancel} style={{
                        background: '#6c757d',
                        color: 'white',
                        padding: '0.6rem 1.2rem',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontWeight: 'bold'
                    }}>Anuluj</button>
                    <button type="submit" style={{
                        background: 'black',
                        color: 'white',
                        padding: '0.6rem 1.2rem',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontWeight: 'bold'
                    }}>Dodaj Wizytę</button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentModal; 