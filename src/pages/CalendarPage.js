import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';

import MonthView from '../components/Calendar/MonthView';
import DaySidebar from '../components/Calendar/DaySidebar';
import AppointmentModal from '../components/AppointmentModal';
import ClientForm from '../components/ClientForm';
import * as userService from '../services/userService';
import { getTreatmentColor, getTextColorForBg } from '../utils/calendarUtils';

const locales = {
    'pl': pl,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date) => startOfWeek(date, { locale: pl }),
    getDay,
    locales,
});

const EventComponent = ({ event, isHovered, onMouseEnter, onMouseLeave }) => {
    const bgColor = getTreatmentColor(event.resource?.treatment);
    const textColor = getTextColorForBg(bgColor); // <-- Dynamiczny kolor tekstu
    const isPast = event.end < new Date();

    const style = {
        height: '100%',
        padding: '2px 6px',
        backgroundColor: bgColor,
        color: textColor, // Użycie dynamicznego koloru
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px',
        fontWeight: 500,
        transition: 'filter 0.2s, box-shadow 0.2s, opacity 0.2s',
        cursor: 'pointer',
        opacity: isPast ? 0.6 : 1,
        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.25)' : '0 1px 3px rgba(0,0,0,0.15)',
        filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
    };

    return (
        <div
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {event.title}
        </div>
    );
};

const CustomToolbar = (toolbar) => {
    const { label, view, views, messages, onNavigate, onView } = toolbar;
    
    // Provide fallback messages to prevent crash if props are not ready
    const viewNames = {
        month: messages?.month || 'Miesiąc',
        week: messages?.week || 'Tydzień',
        day: messages?.day || 'Dzień',
        agenda: messages?.agenda || 'Agenda',
    };

    const todayLabel = messages?.today || 'Dziś';
    const previousLabel = messages?.previous || 'Poprzedni';
    const nextLabel = messages?.next || 'Następny';

    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button type="button" onClick={() => onNavigate('TODAY')}>{todayLabel}</button>
                <button type="button" onClick={() => onNavigate('PREV')}>{previousLabel}</button>
                <button type="button" onClick={() => onNavigate('NEXT')}>{nextLabel}</button>
            </span>
            <span className="rbc-toolbar-label">{label}</span>
            <span className="rbc-btn-group">
                {views.filter(v => v !== 'day').map(v => (
                    <button
                        key={v}
                        type="button"
                        className={view === v ? 'rbc-active' : ''}
                        onClick={() => onView(v)}
                        disabled={view === v}
                    >
                        {viewNames[v]}
                    </button>
                ))}
            </span>
        </div>
    );
};

const CalendarPage = ({ clients, events, setEvents, onAddClient }) => {
    const navigate = useNavigate();
    // --- STATE MANAGEMENT ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');
    const [isAppointmentFormVisible, setIsAppointmentFormVisible] = useState(false);
    const [isClientFormVisible, setIsClientFormVisible] = useState(false);
    const [treatmentTypes, setTreatmentTypes] = useState([]);
    const [newAppointment, setNewAppointment] = useState(null);
    const [hoveredEventId, setHoveredEventId] = useState(null);

    // Set time range for day/week view
    const minTime = new Date();
    minTime.setHours(7, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(23, 0, 0);

    // --- EFFECTS ---
    useEffect(() => {
        const treatments = [
            "Konsultacja kosmetologiczna", "Oczyszczanie wodorowe", "Peeling kawitacyjny",
            "Mikrodermabrazja", "Mezoterapia bezigłowa", "Fale radiowe RF",
            "Zabieg bankietowy", "Masaż twarzy", "Regulacja brwi", "Henna brwi i rzęs"
        ];
        setTreatmentTypes(treatments);
    }, []);

    // --- HANDLERS ---
    const handleNavigate = (newDate) => {
        setCurrentDate(newDate);
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    // New handlers for month navigation
    const handleMonthChange = (newDate) => {
        setCurrentDate(newDate);
    };
    
    const handleSelectSlot = ({ start }) => {
        setCurrentDate(start);
        setCurrentView('day');
        handleShowAppointmentForm(start);
    };

    const handleSelectEvent = (event) => {
        const clientId = event.resource?.clientId;
        if (clientId) {
            navigate(`/client/${clientId}`);
        } else {
            console.warn("Próbowano otworzyć wizytę bez przypisanego klienta.", event);
            toast.warn("Ta wizyta nie ma przypisanego klienta.");
        }
    };

    const getAppointmentsForDate = (date) => {
        return events.filter(event => isSameDay(new Date(event.start), date));
    };
    
    const handleSelectDay = (day) => {
        setCurrentDate(day);
        setCurrentView('day');
        // If form is open, update its date too
        if (isAppointmentFormVisible) {
        setNewAppointment(prev => ({
            ...prev,
                date: format(day, 'yyyy-MM-dd'),
            }));
        }
    };
    
    const handleShowAppointmentForm = (date) => {
        const targetDate = date instanceof Date ? date : new Date(date);
        setNewAppointment({
            id: null,
            clientId: '',
            date: format(targetDate, 'yyyy-MM-dd'),
            time: '12:00',
            duration: 60,
            treatment: '',
            description: '',
        });
        setIsAppointmentFormVisible(true);
        setIsClientFormVisible(false);
    };
    
    const handleClientAdded = (newlyAddedClient) => {
        onAddClient(newlyAddedClient);
        setNewAppointment(prev => ({ ...prev, clientId: newlyAddedClient.id }));
        setIsClientFormVisible(false);
    };

    const handleEditAppointment = (event) => {
        setNewAppointment({
            id: event.id,
            clientId: event.resource.clientId,
            date: format(event.start, 'yyyy-MM-dd'),
            time: format(event.start, 'HH:mm'),
            duration: (event.end.getTime() - event.start.getTime()) / 60000,
            treatment: event.resource.treatment,
            description: event.resource.description,
        });
        setIsAppointmentFormVisible(true);
        setIsClientFormVisible(false);
    };

    const handleDeleteAppointment = (eventToDelete) => {
        if (window.confirm("Czy na pewno chcesz usunąć tę wizytę?")) {
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete.id));
            toast.success("Wizyta została usunięta.");
        }
    };

    const handleSubmitAppointment = (e) => {
        e.preventDefault();
        
        const client = clients.find(c => c.id.toString() === newAppointment.clientId.toString());
        if (!client) {
            toast.error('Proszę wybrać klienta.');
            return;
        }

        const startDate = parse(
            `${newAppointment.date} ${newAppointment.time}`, 
            'yyyy-MM-dd HH:mm', 
            new Date()
        );
        
        const endDate = new Date(startDate.getTime() + newAppointment.duration * 60000);

        const appointmentToSave = {
            id: newAppointment.id || Date.now(),
            title: `${client.firstName} ${client.lastName} - ${newAppointment.treatment}`,
            start: startDate,
            end: endDate,
            resource: {
            clientId: client.id,
                treatment: newAppointment.treatment,
            description: newAppointment.description,
            }
        };

        if (newAppointment.id) {
            setEvents(prev => prev.map(ev => ev.id === newAppointment.id ? appointmentToSave : ev));
            toast.success("Wizyta zaktualizowana!");
        } else {
            setEvents(prev => [...prev, appointmentToSave]);
            toast.success("Dodano wizytę!");
        }
        
        setCurrentDate(startDate);
        setCurrentView('day');
        setIsAppointmentFormVisible(false);
        setNewAppointment(null);
    };
    
    // --- RENDER ---
        return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'flex', padding: '2rem 0', gap: '2rem', justifyContent: 'center' }}>
                
                <div style={{ flex: 1, maxWidth: '600px', display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>Kalendarz Spotkań</h1>
                    {currentView === 'month' ? (
                        <MonthView
                            calendarEvents={events}
                            selectedDate={currentDate}
                            handleSelectDay={handleSelectDay}
                            onMonthChange={handleMonthChange}
                        />
                    ) : (
                        <Calendar
                            culture='pl'
                            localizer={localizer}
                            events={events}
                            style={{ flex: 1, height: 'calc(100vh - 200px)' }}
                            messages={{
                                next: "Następny", previous: "Poprzedni", today: "Dziś",
                                month: "Miesiąc", week: "Tydzień", day: "Dzień", agenda: "Agenda",
                                showMore: total => `+${total} więcej`
                            }}
                            components={{ 
                                toolbar: CustomToolbar,
                                event: (props) => (
                                    <EventComponent
                                        {...props}
                                        isHovered={props.event.id === hoveredEventId}
                                        onMouseEnter={() => setHoveredEventId(props.event.id)}
                                        onMouseLeave={() => setHoveredEventId(null)}
                                    />
                                ),
                            }}
                            view={currentView}
                            onView={handleViewChange}
                            date={currentDate}
                            onNavigate={handleNavigate}
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                            selectable
                            min={minTime}
                            max={maxTime}
                        />
                    )}
                </div>

                <div style={{ flex: '0 0 450px', paddingTop: '4.5rem' }}>
                    {isAppointmentFormVisible ? (
                        isClientFormVisible ? (
                            <ClientForm
                                onAddClient={handleClientAdded}
                                onCancel={() => setIsClientFormVisible(false)}
                            />
                        ) : (
                            <AppointmentModal
                                newAppointment={newAppointment}
                                setNewAppointment={setNewAppointment}
                                clients={clients}
                                onSave={handleSubmitAppointment}
                                onCancel={() => setIsAppointmentFormVisible(false)}
                                onAddNewClient={() => setIsClientFormVisible(true)}
                                availableTreatments={treatmentTypes}
                            />
                        )
                    ) : (
                        <DaySidebar
                            selectedDate={currentDate}
                            appointments={getAppointmentsForDate(currentDate)}
                            onAddAppointment={() => handleShowAppointmentForm(currentDate)}
                            onEdit={handleEditAppointment}
                            onDelete={handleDeleteAppointment}
                            hoveredEventId={hoveredEventId}
                            setHoveredEventId={setHoveredEventId}
                            getTreatmentColor={getTreatmentColor}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage; 