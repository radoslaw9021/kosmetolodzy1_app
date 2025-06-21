import React from 'react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const DashboardPage = ({ appointments = [], clients = [], onAddAppointment, onAddClient, onGoToCalendar }) => {
    // Statystyki
    const today = new Date();
    const todayAppointments = appointments.filter(app => isToday(parseISO(app.date)));
    const tomorrowAppointments = appointments.filter(app => isTomorrow(parseISO(app.date)));
    const newClientsThisWeek = clients.filter(c => {
        const created = c.createdAt ? new Date(c.createdAt) : null;
        if (!created) return false;
        const now = new Date();
        const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        return created >= weekAgo && created <= now;
    });

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Dashboard</h1>
            <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                {/* Kafelek: wizyty dziś */}
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e5e7eb', padding: 28, flex: 1 }}>
                    <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Wizyty dzisiaj</div>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>{todayAppointments.length}</div>
                </div>
                {/* Kafelek: wizyty jutro */}
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e5e7eb', padding: 28, flex: 1 }}>
                    <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Wizyty jutro</div>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>{tomorrowAppointments.length}</div>
                </div>
                {/* Kafelek: nowi klienci w tygodniu */}
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e5e7eb', padding: 28, flex: 1 }}>
                    <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Nowe klientki (7 dni)</div>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>{newClientsThisWeek.length}</div>
                </div>
            </div>

            {/* Nadchodzące wizyty */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e5e7eb', padding: 28, marginBottom: 32 }}>
                <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Nadchodzące wizyty (dziś/jutro)</div>
                {todayAppointments.concat(tomorrowAppointments).length === 0 ? (
                    <div style={{ color: '#888', fontSize: 15 }}>Brak zaplanowanych wizyt na dziś i jutro.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {todayAppointments.concat(tomorrowAppointments).map(app => (
                            <div key={app.id} style={{ background: '#f7fafc', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px #e5e7eb' }}>
                                <div style={{ fontWeight: 600, fontSize: 15 }}>{app.clientName}</div>
                                <div style={{ fontSize: 13, color: '#555' }}>{app.description || 'Brak opisu'}</div>
                                <div style={{ fontSize: 13, color: '#0077cc', marginLeft: 'auto' }}>{format(parseISO(app.date), 'dd.MM.yyyy')} {app.time}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Szybkie akcje */}
            <div style={{ display: 'flex', gap: 16 }}>
                <button onClick={onAddAppointment} style={{ background: '#0077cc', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><AddIcon />Dodaj wizytę</button>
                <button onClick={onAddClient} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><PersonAddIcon />Dodaj klientkę</button>
                <button onClick={onGoToCalendar} style={{ background: '#fff', color: '#0077cc', border: '2px solid #0077cc', borderRadius: 10, padding: '12px 22px', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><CalendarMonthIcon />Kalendarz</button>
            </div>
        </div>
    );
};

export default DashboardPage; 