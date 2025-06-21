import React, { useState, useEffect } from 'react';
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

const CalendarPage = ({ clients, events, setEvents, onAddClient }) => {
    // --- STATE MANAGEMENT ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');
    const [isAppointmentFormVisible, setIsAppointmentFormVisible] = useState(false);
    const [isClientFormVisible, setIsClientFormVisible] = useState(false);
    const [treatmentTypes, setTreatmentTypes] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        clientId: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        duration: 60,
        treatment: '',
        description: '',
    });

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
    
    const handleSelectSlot = ({ start }) => {
        setCurrentDate(start);
        setCurrentView('day');
        handleShowAppointmentForm(start);
    };

    const handleSelectEvent = (event) => {
        setCurrentDate(event.start);
        setCurrentView('day');
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
        setIsClientFormVisible(false);
    };
    
    const handleClientAdded = (newlyAddedClient) => {
        onAddClient(newlyAddedClient);
        setNewAppointment(prev => ({ ...prev, clientId: newlyAddedClient.id }));
        setIsClientFormVisible(false);
    };

    const handleSubmitAppointment = (e) => {
        e.preventDefault();
        
        const client = clients.find(c => c.id.toString() === newAppointment.clientId.toString());
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
        
        setCurrentDate(startDate);
        setCurrentView('day');
        setIsAppointmentFormVisible(false);
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
                            handleSelectDay={(day) => {
                                setCurrentDate(day);
                                setCurrentView('day');
                            }}
                        />
                    ) : (
                        <Calendar
                            localizer={localizer}
                            events={events}
                            style={{ flex: 1, height: 'calc(100vh - 200px)' }}
                            messages={{
                                next: "Następny", previous: "Poprzedni", today: "Dziś",
                                month: "Miesiąc", week: "Tydzień", day: "Dzień", agenda: "Agenda",
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
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage; 