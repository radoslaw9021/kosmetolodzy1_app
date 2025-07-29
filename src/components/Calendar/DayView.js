import React from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

// Funkcja do określania ikony na podstawie opisu usługi
const getServiceIcon = (desc) => {
    if (!desc) return '';
    const d = desc.toLowerCase();
    if (d.includes('mezoterapia')) return '🧬';
    if (d.includes('oczyszczanie')) return '💧';
    if (d.includes('laser')) return '🔦';
    if (d.includes('peeling')) return '✨';
    if (d.includes('mikrodermabrazja')) return '💎';
    if (d.includes('botoks')) return '💉';
    if (d.includes('kwas')) return '🧪';
    if (d.includes('masaż')) return '💆';
    if (d.includes('konsultacja')) return '👩‍⚕️';
    if (d.includes('fale radiowe')) return '📡';
    if (d.includes('lifting')) return '✨';
    return '💅';
};

// Komponent karty wydarzenia
const EventCard = ({ event, onEventClick }) => {
    try {
        const startTime = format(new Date(event.start), 'HH:mm');
        const endTime = format(new Date(event.end), 'HH:mm');
        
        return (
            <div 
                className="event-card" 
                onClick={(e) => {
                    e.stopPropagation();
                    if (onEventClick) onEventClick(event);
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onEventClick) onEventClick(event);
                }}
                title="Kliknij, aby zobaczyć szczegóły"
            >
                <div className="event-icon">{getServiceIcon(event.resource?.description)}</div>
                <div className="event-content">
                    <div className="event-title">{event.title}</div>
                    <div className="event-time">
                        {startTime} - {endTime}
                    </div>
                    {event.resource?.description && (
                        <div className="event-description">{event.resource.description}</div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Błąd podczas renderowania wydarzenia:', error, event);
        return (
            <div className="event-card error">
                <div className="event-content">
                    <div className="event-title">Błąd wyświetlania</div>
                </div>
            </div>
        );
    }
};

// Komponent kafelka wizyty
const AppointmentTile = ({ event, onEventClick, onDoubleClick }) => {
    const handleClick = (e) => {
        e.stopPropagation();
        if (onEventClick) onEventClick(event);
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (onDoubleClick) onDoubleClick(event);
    };

    // Wyciągnij imię i nazwisko z tytułu
    const titleParts = event.title.split(' - ');
    const clientName = titleParts[0] || event.title;
    const serviceName = event.resource?.description || event.resource?.treatment || titleParts[1] || 'Zabieg';
    const description = event.resource?.description || 'Brak dodatkowego opisu';

    return (
        <div 
            className="appointment-tile" 
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            title="Kliknij, aby zobaczyć szczegóły"
        >
            <div className="appointment-title">
                <span>{getServiceIcon(serviceName)}</span> <strong>{clientName}</strong> – {serviceName}
            </div>
            <div className="appointment-time">
                {format(new Date(event.start), 'HH:mm')} – {format(new Date(event.end), 'HH:mm')}
            </div>
        </div>
    );
};

// Główny komponent DayView
const DayView = ({
    calendarEvents,
    selectedDate,
    handleSelectEvent,
    handleSelectSlot,
    onBackToMonth,
    onShowAppointmentForm,
}) => {
    // Generuj godziny od 7:00 do 22:00
    const hours = Array.from({ length: 16 }, (_, i) => i + 7);

    // Filtruj wydarzenia tylko dla wybranej daty
    const eventsForSelectedDate = calendarEvents.filter(event => {
        try {
            const eventDate = new Date(event.start);
            const selectedDateObj = new Date(selectedDate);
            return eventDate.toDateString() === selectedDateObj.toDateString();
        } catch (error) {
            console.error('Błąd podczas filtrowania wydarzeń:', error);
            return false;
        }
    });





    const handleSlotClick = (date) => {
        // Ustaw wybraną datę na konkretną godzinę
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(date.getHours(), 0, 0, 0);
        
        if (handleSelectSlot) {
            handleSelectSlot({ start: selectedDateTime });
        }
    };

    const handleEventClick = (event) => {
        if (handleSelectEvent) {
            handleSelectEvent(event);
        }
    };

    const handleDoubleClick = (date) => {
        // Ustaw wybraną datę na konkretną godzinę
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(date.getHours(), 0, 0, 0);
        
        if (onShowAppointmentForm) {
            onShowAppointmentForm(selectedDateTime);
        }
    };

    return (
        <div className="day-view-container">
            <div className="day-view-header">
                <h2>{format(selectedDate, 'EEEE, d MMMM yyyy', { locale: pl })}</h2>
                <button 
                    className="back-to-month-btn" 
                    onClick={onBackToMonth}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 4px 20px 0 #a855f7cc, 0 0 0 4px #fff2 inset';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 2px 12px #a855f7aa, 0 0 0 2px #fff2 inset';
                    }}
                >
                    ← Powrót
                </button>
            </div>

            <div className="appointments-grid">
                {eventsForSelectedDate.length > 0 ? (
                    eventsForSelectedDate.map((event, index) => (
                        <AppointmentTile
                            key={event.id || index}
                            event={event}
                            onEventClick={handleEventClick}
                            onDoubleClick={handleDoubleClick}
                        />
                    ))
                ) : (
                    <div className="no-appointments">
                        <div className="no-appointments-icon">📅</div>
                        <div className="no-appointments-text">Brak zaplanowanych wizyt na dziś</div>
                        <div className="no-appointments-subtext">Kliknij dwukrotnie na dowolny slot, aby dodać wizytę</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DayView;
