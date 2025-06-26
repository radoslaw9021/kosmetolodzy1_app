import React, { useRef } from 'react';
import { format, isToday, isTomorrow } from 'date-fns';
import { pl } from 'date-fns/locale';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import { getTextColorForBg } from '../utils/calendarUtils';
import SpotlightCard from '../components/SpotlightCard';
import { motion } from 'framer-motion';
import './DashboardPage.css';

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

    const headerBorderRef = useRef(null);

    // Obsługa pozycji myszy dla efektu spotlight
    const handleMouseMove = (e) => {
        const el = headerBorderRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
    };
    const handleMouseLeave = () => {
        const el = headerBorderRef.current;
        if (!el) return;
        el.style.setProperty('--mouse-x', `50%`);
        el.style.setProperty('--mouse-y', `50%`);
    };

    return (
        <div className="dashboard-bg">
            <div className="dashboard-container">
                <div
                  className="dashboard-header-border spotlight-hover-effect"
                  ref={headerBorderRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.div
                    className="dashboard-header-animated"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  >
                    <CalendarMonthIcon className="dashboard-header-icon" />
                    <span className="dashboard-header-title">Strona główna</span>
                  </motion.div>
                </div>
                {/* Statystyki - Spotlight Cards */}
                <div className="dashboard-stats-grid">
                    <SpotlightCard color="#a855f7">
                        <div className="stat-content">
                            <TodayIcon className="stat-icon" />
                            <div className="stat-label">Wizyty dzisiaj</div>
                            <div className="stat-value">{todayAppointments.length}</div>
                        </div>
                    </SpotlightCard>
                    
                    <SpotlightCard color="#6366f1">
                        <div className="stat-content">
                            <EventIcon className="stat-icon" />
                            <div className="stat-label">Wizyty jutro</div>
                            <div className="stat-value">{tomorrowAppointments.length}</div>
                        </div>
                    </SpotlightCard>
                    
                    <SpotlightCard color="#f59e42">
                        <div className="stat-content">
                            <GroupIcon className="stat-icon" />
                            <div className="stat-label">Nowe klientki (7 dni)</div>
                            <div className="stat-value">{newClientsThisWeek.length}</div>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Najbliższe wizyty */}
                <div className="upcoming-appointments-section">
                    <h2 className="upcoming-appointments-title">Najbliższe wizyty</h2>
                    <div className="appointment-list">
                        {upcoming.length === 0 ? (
                            <div className="no-appointments">Brak zaplanowanych wizyt na dziś i jutro.</div>
                        ) : (
                            upcoming.map(ev => {
                                const colorMap = {
                                    "Konsultacja kosmetologiczna": {cls: 'purple', color: '#a855f7'},
                                    "Oczyszczanie wodorowe": {cls: 'green', color: '#34d399'},
                                    "Peeling kawitacyjny": {cls: 'purple', color: '#a855f7'},
                                    "Mikrodermabrazja": {cls: 'purple', color: '#a855f7'},
                                    "Mezoterapia bezigłowa": {cls: 'purple', color: '#a855f7'},
                                    "Fale radiowe RF": {cls: 'green', color: '#34d399'},
                                    "Zabieg bankietowy": {cls: 'red', color: '#f43f5e'},
                                    "Masaż twarzy": {cls: 'purple', color: '#a855f7'},
                                    "Regulacja brwi": {cls: 'green', color: '#34d399'},
                                    "Henna brwi i rzęs": {cls: 'purple', color: '#a855f7'},
                                    "default": {cls: '', color: '#6b7280'}
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
                                    <SpotlightCard key={'visit-' + ev.id} color={color.color} className="appointment-spotlight-card">
                                        <div className="appointment-content">
                                            <div className="appointment-left">
                                                <span className="appointment-dot"></span>
                                                <span className="appointment-time">⏰ {time}</span>
                                                <span className="appointment-name">
                                                    {ev.resource?.clientName || (ev.title ? ev.title.split(' - ')[0] : 'Brak imienia')}
                                                </span>
                                            </div>
                                            <div className="appointment-right">
                                                {treatments.map((treat, idx) => (
                                                    <span key={idx} className="treatment-badge">{treat}</span>
                                                ))}
                                                <span className="appointment-date">{date}</span>
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Akcje */}
                <div className="dashboard-actions">
                    <button onClick={onAddAppointment} className="action-btn primary">
                        <AddIcon />
                        Dodaj wizytę
                    </button>
                    <button onClick={onAddClient} className="action-btn secondary">
                        <PersonAddIcon />
                        Dodaj klientkę
                    </button>
                    <button onClick={onGoToCalendar} className="action-btn tertiary">
                        <CalendarMonthIcon />
                        Kalendarz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage; 