import React, { useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const DashboardPage = ({ events = [], clients = [], onAddAppointment, onAddClient, onGoToCalendar }) => {
    // Spotlight effect for appointment cards
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

    return (
        <div className="dashboard">
            <header>
                <h1>Panel główny</h1>
            </header>
            
            <section className="stats">
                <div className="stat-card">
                    <div className="stat-title">Liczba klientek</div>
                    <div className="stat-value">18</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Wizyty dzisiaj</div>
                    <div className="stat-value">3</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Nowe klientki (7 dni)</div>
                    <div className="stat-value">0</div>
                </div>
            </section>
            
            <section className="appointments">
                <h2>Najbliższe wizyty</h2>
                <div className="appointment">
                    <span>Zdziś Tymon – K</span>
                    <span>12:00 - 13:00</span>
                </div>
                <div className="appointment">
                    <span>Róża Tymon – Z</span>
                    <span>16:00 - 17:00</span>
                </div>
                <div className="appointment">
                    <span>R2 Tymon – R</span>
                    <span>14:20 - 15:20</span>
                </div>
            </section>
        </div>
    );
};

export default DashboardPage; 