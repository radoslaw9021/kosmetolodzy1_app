import React from 'react';
import { format, isToday, isTomorrow } from 'date-fns';
import { pl } from 'date-fns/locale';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getTextColorForBg } from '../utils/calendarUtils';

const DashboardPage = ({ events = [], clients = [], onAddAppointment, onAddClient, onGoToCalendar }) => {
    // Statystyki
    const today = new Date();
    const todayAppointments = events.filter(ev => isToday(new Date(ev.start)));
    const tomorrowAppointments = events.filter(ev => isTomorrow(new Date(ev.start)));
    const newClientsThisWeek = clients.filter(c => {
        const created = c.createdAt ? new Date(c.createdAt) : null;
        if (!created) return false;
        const now = new Date();
        const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        return created >= weekAgo && created <= now;
    });

    // Najbliższe wizyty (dziś i jutro)
    const upcoming = [...todayAppointments, ...tomorrowAppointments].sort((a, b) => new Date(a.start) - new Date(b.start));

    return (
        <div className="dashboard-main" style={{ maxWidth: 800, margin: '0 auto', padding: '2.5rem 2rem' }}>
            <h1 className="dashboard-title" style={{ textAlign: 'center' }}>
                <span style={{fontSize:22, color:'#6A1B9A', marginRight:8}}>📅</span> Dashboard
            </h1>
            {/* Statystyki */}
            <div className="dashboard-stats-row" style={{ gap: 40, marginBottom: 48, width: '100%' }}>
                <div className="card dashboard-stat-tile" style={{ width: '100%' }}>
                    <div className="dashboard-stat-label">Wizyty dzisiaj</div>
                    <div className="dashboard-stat-value">{todayAppointments.length}</div>
                </div>
                <div className="card dashboard-stat-tile" style={{ width: '100%' }}>
                    <div className="dashboard-stat-label">Wizyty jutro</div>
                    <div className="dashboard-stat-value">{tomorrowAppointments.length}</div>
                </div>
                <div className="card dashboard-stat-tile" style={{ width: '100%' }}>
                    <div className="dashboard-stat-label">Nowe klientki (7 dni)</div>
                    <div className="dashboard-stat-value">{newClientsThisWeek.length}</div>
                </div>
            </div>
            {/* Lista wizyt */}
            <div className="appointment-list">
                {upcoming.length === 0 ? (
                    <div style={{ color: '#888', fontSize: 16, fontWeight: 400, textAlign: 'center', padding: '18px 0' }}>Brak zaplanowanych wizyt na dziś i jutro.</div>
                ) : (
                    upcoming.map(ev => {
                        const colorMap = {
                            "Konsultacja kosmetologiczna": {cls: 'purple'},
                            "Oczyszczanie wodorowe": {cls: 'green'},
                            "Peeling kawitacyjny": {cls: 'purple'},
                            "Mikrodermabrazja": {cls: 'purple'},
                            "Mezoterapia bezigłowa": {cls: 'purple'},
                            "Fale radiowe RF": {cls: 'green'},
                            "Zabieg bankietowy": {cls: 'red'},
                            "Masaż twarzy": {cls: 'purple'},
                            "Regulacja brwi": {cls: 'green'},
                            "Henna brwi i rzęs": {cls: 'purple'},
                            "default": {cls: ''}
                        };
                        let treatments = ev.resource?.treatment;
                        if (Array.isArray(treatments)) treatments = treatments.filter(Boolean);
                        else if (typeof treatments === 'string' && treatments) treatments = [treatments];
                        else treatments = [];
                        const mainTreatment = treatments[0] || 'default';
                        const color = colorMap[mainTreatment] || colorMap.default;
                        const time = format(new Date(ev.start), 'HH:mm');
                        const date = format(new Date(ev.start), 'dd.MM.yyyy');
                        return (
                            <div className={`appointment-card ${color.cls}`} key={'visit-' + ev.id}>
                                <div className="left">
                                    <span className="dot" style={{background:'#6A1B9A'}}></span>
                                    <span className="hour" style={{color:'#6A1B9A'}}>⏰ {time}</span>
                                    <span className="name">{ev.resource?.clientName || (ev.title ? ev.title.split(' - ')[0] : 'Brak imienia')}</span>
                                </div>
                                <div className="right">
                                    {treatments.map((treat, idx) => (
                                        <span key={idx} className={`badge${colorMap[treat]?.cls ? ' ' + colorMap[treat].cls : ''}`}>{treat}</span>
                                    ))}
                                    <span className="date-badge">{date}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {/* Akcje */}
            <div className="dashboard-actions-row" style={{ marginTop: 32 }}>
                <button onClick={onAddAppointment} className="dashboard-action-btn"><span style={{fontSize:18,marginRight:6}}>+</span> Dodaj wizytę</button>
                <button onClick={onAddClient} className="dashboard-action-btn"><span style={{fontSize:18,marginRight:6}}>+</span> Dodaj klientkę</button>
            </div>
        </div>
    );
};

export default DashboardPage; 