import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isAfter, subDays } from 'date-fns';
import { pl } from 'date-fns/locale';

const DashboardPage = ({ events = [], clients = [], onAddAppointment, onAddClient, onGoToCalendar }) => {
    const navigate = useNavigate();

    // Spotlight effect for appointment cards (oryginalny kod)
    useEffect(() => {
        const appointmentCards = document.querySelectorAll('.appointment');
        appointmentCards.forEach(card => {
            const handleMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            };
            card.addEventListener('mousemove', handleMouseMove);
            return () => {
                card.removeEventListener('mousemove', handleMouseMove);
            };
        });
    }, []);

    // Dynamiczne obliczenia danych
    const dashboardData = useMemo(() => {
        const today = new Date();
        const sevenDaysAgo = subDays(today, 7);
        const totalClients = clients.length;
        const todayEvents = events.filter(event => {
            const eventDate = new Date(event.start);
            return isToday(eventDate);
        });
        const newClientsLast7Days = clients.filter(client => {
            if (client.createdAt) {
                const clientCreatedAt = new Date(client.createdAt);
                return isAfter(clientCreatedAt, sevenDaysAgo);
            }
            return false;
        }).length;
        const upcomingEvents = events
            .filter(event => {
                const eventDate = new Date(event.start);
                return isAfter(eventDate, today);
            })
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5);
        return {
            totalClients,
            todayEvents: todayEvents.length,
            newClientsLast7Days,
            upcomingEvents
        };
    }, [clients, events]);

    // Handlery dla przekierowań
    const handleClientsClick = () => {
        navigate('/clients');
    };
    const handleTodayAppointmentsClick = () => {
        navigate('/calendar', { 
            state: { 
                selectedDate: new Date(),
                view: 'day'
            }
        });
    };
    const handleAppointmentClick = (event) => {
        if (event.resource?.clientId) {
            navigate(`/client/${event.resource.clientId}`);
        }
    };

    // Oryginalny layout i style
    return (
        <div className="dashboard">
            <header>
                <h1>Panel główny</h1>
            </header>
            <section className="stats">
                <div className="stat-card" onClick={handleClientsClick} style={{ cursor: 'pointer' }}>
                    <div className="stat-title">Liczba klientek</div>
                    <div className="stat-value">{dashboardData.totalClients}</div>
                </div>
                <div className="stat-card" onClick={handleTodayAppointmentsClick} style={{ cursor: 'pointer' }}>
                    <div className="stat-title">Wizyty dzisiaj</div>
                    <div className="stat-value">{dashboardData.todayEvents}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Nowe klientki (7 dni)</div>
                    <div className="stat-value">{dashboardData.newClientsLast7Days}</div>
                </div>
            </section>
            <section className="appointments">
                <h2>Najbliższe wizyty</h2>
                {dashboardData.upcomingEvents.length > 0 ? (
                    dashboardData.upcomingEvents.map((event, index) => {
                        const client = clients.find(c => c.id === event.resource?.clientId);
                        const clientName = client ? `${client.firstName} ${client.lastName}` : 'Nieznany klient';
                        return (
                            <div 
                                key={event.id || index} 
                                className="appointment"
                                onClick={() => handleAppointmentClick(event)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span>{clientName} – {event.resource?.treatment || 'Brak nazwy zabiegu'}</span>
                                <span>{format(new Date(event.start), 'HH:mm', { locale: pl })} - {format(new Date(event.end), 'HH:mm', { locale: pl })}</span>
                            </div>
                        );
                    })
                ) : (
                    <div className="appointment">
                        <span>Brak zaplanowanych wizyt</span>
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardPage; 