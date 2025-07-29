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
        <div style={{
            background: 'rgba(30,28,50,0.7)',
            border: 'none',
            borderRadius: '1.7rem',
            boxShadow: '0 0 32px 0 #a855f7aa, 0 0 0 4px #fff2 inset, 0 4px 24px #a855f7cc',
            padding: '2.2rem 1.5rem',
            color: '#fff',
            fontFamily: 'var(--font-primary)',
            animation: 'fadeInUp 0.7s cubic-bezier(.4,2,.6,1)'
        }}>
            <h3 style={{ 
                fontWeight: '800', 
                fontSize: '1.18rem', 
                marginBottom: '1.5rem',
                background: 'linear-gradient(90deg, #a855f7, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 20px #a855f7cc',
                borderBottom: '1.5px solid #a855f733',
                paddingBottom: '0.5rem'
            }}>Dodaj Nową Wizytę</h3>
            <form onSubmit={onSave}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                        display: 'block', 
                        color: '#a855f7',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                    }}>Klient</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                            name="clientId"
                            value={newAppointment.clientId}
                            onChange={handleChange}
                            style={{
                                flexGrow: 1,
                                width: '100%',
                                padding: '0.7rem 1.1rem',
                                border: '1.5px solid #a855f7',
                                borderRadius: '1.1rem',
                                background: 'rgba(40, 30, 60, 0.92)',
                                color: '#fff',
                                fontSize: '1.08rem',
                                fontFamily: 'inherit',
                                outline: 'none',
                                transition: 'border 0.18s, box-shadow 0.18s',
                                boxShadow: '0 2px 16px #a855f733, 0 0 0 2px #fff2 inset'
                            }}
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
                                borderRadius: '1.1rem',
                                padding: '0.7rem 1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                flexShrink: 0,
                                transition: 'all 0.2s ease'
                            }}>
                            + Nowy
                        </button>
                    </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                        display: 'block', 
                        color: '#a855f7',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                    }}>Data</label>
                    <input
                        type="date"
                        name="date"
                        value={newAppointment.date instanceof Date 
                            ? newAppointment.date.toISOString().split('T')[0] 
                            : newAppointment.date || ''}
                        onChange={handleDateChange}
                        style={{
                            width: '100%',
                            padding: '0.7rem 1.1rem',
                            border: '1.5px solid #a855f7',
                            borderRadius: '1.1rem',
                            background: 'rgba(40, 30, 60, 0.92)',
                            color: '#fff',
                            fontSize: '1.08rem',
                            fontFamily: 'inherit',
                            outline: 'none',
                            transition: 'border 0.18s, box-shadow 0.18s',
                            boxShadow: '0 2px 16px #a855f733, 0 0 0 2px #fff2 inset'
                        }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                        display: 'block', 
                        color: '#a855f7',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                    }}>Godzina</label>
                    <input
                        type="time"
                        name="time"
                        value={newAppointment.time}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '0.7rem 1.1rem',
                            border: '1.5px solid #a855f7',
                            borderRadius: '1.1rem',
                            background: 'rgba(40, 30, 60, 0.92)',
                            color: '#fff',
                            fontSize: '1.08rem',
                            fontFamily: 'inherit',
                            outline: 'none',
                            transition: 'border 0.18s, box-shadow 0.18s',
                            boxShadow: '0 2px 16px #a855f733, 0 0 0 2px #fff2 inset'
                        }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                        display: 'block', 
                        color: '#a855f7',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                    }}>Szacowany czas (min)</label>
                    <input
                        type="number"
                        name="duration"
                        value={newAppointment.duration}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '0.7rem 1.1rem',
                            border: '1.5px solid #a855f7',
                            borderRadius: '1.1rem',
                            background: 'rgba(40, 30, 60, 0.92)',
                            color: '#fff',
                            fontSize: '1.08rem',
                            fontFamily: 'inherit',
                            outline: 'none',
                            transition: 'border 0.18s, box-shadow 0.18s',
                            boxShadow: '0 2px 16px #a855f733, 0 0 0 2px #fff2 inset'
                        }}
                        required
                    />
                </div>
                 <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                        display: 'block', 
                        color: '#a855f7',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                    }}>Zabieg</label>
                    <select
                        name="treatment"
                        value={newAppointment.treatment}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '0.7rem 1.1rem',
                            border: '1.5px solid #a855f7',
                            borderRadius: '1.1rem',
                            background: 'rgba(40, 30, 60, 0.92)',
                            color: '#fff',
                            fontSize: '1.08rem',
                            fontFamily: 'inherit',
                            outline: 'none',
                            transition: 'border 0.18s, box-shadow 0.18s',
                            boxShadow: '0 2px 16px #a855f733, 0 0 0 2px #fff2 inset'
                        }}
                        required
                    >
                        <option value="">-- wybierz --</option>
                        {availableTreatments.map(treatment => (
                           <option key={treatment} value={treatment}>{treatment}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                        display: 'block', 
                        color: '#a855f7',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                    }}>Komentarz do zabiegu</label>
                    <textarea
                        name="description"
                        rows="3"
                        value={newAppointment.description}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '0.7rem 1.1rem',
                            border: '1.5px solid #a855f7',
                            borderRadius: '1.1rem',
                            background: 'rgba(40, 30, 60, 0.92)',
                            color: '#fff',
                            fontSize: '1.08rem',
                            fontFamily: 'inherit',
                            outline: 'none',
                            transition: 'border 0.18s, box-shadow 0.18s',
                            boxShadow: '0 2px 16px #a855f733, 0 0 0 2px #fff2 inset',
                            resize: 'vertical',
                            minHeight: '48px'
                        }}
                    ></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="button" onClick={onCancel} style={{
                        background: '#6c757d',
                        color: 'white',
                        padding: '0.7rem 1.1rem',
                        border: 'none',
                        borderRadius: '1.1rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease'
                    }}>Anuluj</button>
                    <button type="submit" style={{
                        background: 'black',
                        color: 'white',
                        padding: '0.7rem 1.1rem',
                        border: 'none',
                        borderRadius: '1.1rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease'
                    }}>Dodaj Wizytę</button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentModal; 