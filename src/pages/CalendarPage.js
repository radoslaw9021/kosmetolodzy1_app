import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pl';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';

import MonthView from '../components/Calendar/MonthView';
import DaySidebar from '../components/Calendar/DaySidebar';
import AppointmentModal from '../components/AppointmentModal';
import ClientForm from '../components/ClientForm';
import * as userService from '../services/userService';

moment.locale('pl');
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    // --- STATE MANAGEMENT ---
    // State for appointments, ensuring dates are proper Date objects
    const [events, setEvents] = useState(() => {
        try {
            const storedAppointments = localStorage.getItem('appointments');
            if (storedAppointments) {
                const parsed = JSON.parse(storedAppointments);
                return parsed.map(e => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end),
                }));
            }
        } catch (error) {
            console.error("Failed to parse appointments from localStorage", error);
        }
        return [];
    });

    // Single source of truth for date and view
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');
    
    // States for controlling the UI
    const [isAppointmentFormVisible, setIsAppointmentFormVisible] = useState(false);
    const [isClientFormVisible, setIsClientFormVisible] = useState(false);

    // States for data
    const [localClients, setLocalClients] = useState([]);
    const [treatmentTypes, setTreatmentTypes] = useState([]);

    // State for the new appointment form
    const [newAppointment, setNewAppointment] = useState({
        clientId: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        duration: 60,
        treatment: '',
        description: '',
    });

    // --- EFFECTS ---
    // Initialize users and treatments on component mount
    useEffect(() => {
        const allUsers = userService.getUsers();
        const clientsExist = allUsers.some(u => u.role === 'Klient');

        if (!clientsExist) {
            // If no clients are found, it means the data is from an old version.
            // A hard reset is performed to ensure the new data structure with clients is present.
            const freshUsers = userService.resetUsersToDefault();
            setLocalClients(freshUsers.filter(u => u.role === 'Klient'));
        } else {
            // If clients exist, use the current user list.
            setLocalClients(allUsers.filter(u => u.role === 'Klient'));
        }

        const treatments = [
            "Konsultacja kosmetologiczna", "Oczyszczanie wodorowe", "Peeling kawitacyjny",
            "Mikrodermabrazja", "Mezoterapia bezigłowa", "Fale radiowe RF",
            "Zabieg bankietowy", "Masaż twarzy", "Regulacja brwi", "Henna brwi i rzęs"
        ];
        setTreatmentTypes(treatments);
    }, []);

    // Persist events to localStorage
    useEffect(() => {
        localStorage.setItem('appointments', JSON.stringify(events));
    }, [events]);

    // --- HANDLERS ---
    const handleNavigate = (newDate) => {
        setCurrentDate(newDate);
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    const handleSelectSlot = ({ start }) => {
        setCurrentDate(start);
        setCurrentView('day');
        handleShowAppointmentForm(start);
    };

    const handleSelectEvent = (event) => {
        // For now, simply navigate to the day of the event
        setCurrentDate(event.start);
        setCurrentView('day');
        // A future implementation could open an edit form here
    };

    const getAppointmentsForDate = (date) => {
        return events.filter(event => moment(event.start).isSame(date, 'day'));
    };
    
    const handleShowAppointmentForm = (date) => {
        const targetDate = date instanceof Date ? date : new Date(date);
        setNewAppointment(prev => ({
            ...prev,
            date: targetDate.toISOString().split('T')[0],
            clientId: '',
            time: '12:00',
            duration: 60,
            treatment: '',
            description: '',
        }));
        setIsAppointmentFormVisible(true);
        setIsClientFormVisible(false); // Ensure client form is hidden
    };
    
    const handleClientAdded = (newlyAddedClient) => {
        setLocalClients(prevClients => [...prevClients, newlyAddedClient]);
        setNewAppointment(prev => ({ ...prev, clientId: newlyAddedClient.id }));
        setIsClientFormVisible(false);
    };

    const handleSubmitAppointment = (e) => {
        e.preventDefault();
        
        const client = localClients.find(c => c.id.toString() === newAppointment.clientId.toString());
        if (!client) {
            toast.error('Proszę wybrać klienta.');
            return;
        }

        const [year, month, day] = newAppointment.date.split('-').map(Number);
        const [hours, minutes] = newAppointment.time.split(':').map(Number);
        
        const startDate = new Date(year, month - 1, day, hours, minutes);
        const endDate = moment(startDate).add(newAppointment.duration, 'minutes').toDate();

        const appointmentToSave = {
            id: Date.now(),
            title: `${client.firstName} ${client.lastName} - ${newAppointment.treatment}`,
            start: startDate,
            end: endDate,
            resource: {
                clientId: client.id,
                treatment: newAppointment.treatment,
                description: newAppointment.description,
            }
        };
        
        setEvents(prev => [...prev, appointmentToSave]);
        toast.success("Dodano wizytę!");
        
        // Navigate to the new appointment and close the form
        setCurrentDate(startDate);
        setCurrentView('day');
        setIsAppointmentFormVisible(false);
    };
    
    // --- RENDER ---
    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'flex', padding: '2rem 0', gap: '2rem', justifyContent: 'center' }}>
                
                {/* --- LEWA KOLUMNA: KALENDARZ --- */}
                <div style={{ flex: 1, maxWidth: '600px', display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>Kalendarz Spotkań</h1>
                    {currentView === 'month' ? (
                        <MonthView
                            calendarEvents={events}
                            selectedDate={currentDate}
                            handleSelectDay={(day) => {
                                setCurrentDate(day);
                                setCurrentView('day');
                            }}
                        />
                    ) : (
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ flex: 1 }}
                            messages={{
                                next: "Następny", previous: "Poprzedni", today: "Dziś",
                                month: "Miesiąc", week: "Tydzień", day: "Dzień", agenda: "Agenda",
                                noEventsInRange: "Brak wizyt w tym zakresie.",
                                showMore: total => `+${total} więcej`
                            }}
                            view={currentView}
                            onView={handleViewChange}
                            date={currentDate}
                            onNavigate={handleNavigate}
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                            selectable
                        />
                    )}
                </div>

                {/* --- PRAWA KOLUMNA: PANEL BOCZNY --- */}
                <div style={{ flex: '0 0 450px', paddingTop: '4.5rem' }}>
                    {isAppointmentFormVisible ? (
                        isClientFormVisible ? (
                            <ClientForm
                                onClientAdded={handleClientAdded}
                                onCancel={() => setIsClientFormVisible(false)}
                            />
                        ) : (
                            <AppointmentModal
                                newAppointment={newAppointment}
                                setNewAppointment={setNewAppointment}
                                clients={localClients}
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
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage; 