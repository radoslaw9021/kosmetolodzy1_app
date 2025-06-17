import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pl';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, isSameDay, differenceInMinutes, addMinutes } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import MonthView from '../components/Calendar/MonthView';
import DayView from '../components/Calendar/DayView';
import WeekView from '../components/Calendar/WeekView';
import AgendaView from '../components/Calendar/AgendaView';
import ClientDrawer from '../components/ClientDrawer';
import ControlPanel from '../components/ControlPanel';
// Importy dla ikon Material UI - będą przeniesione do MonthView.js
// import ViewModuleIcon from '@mui/icons-material/ViewModule';
// import ViewWeekIcon from '@mui/icons-material/ViewWeek';
// import ViewDayIcon from '@mui/icons-material/ViewDay';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import TodayIcon from '@mui/icons-material/Today';
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';

moment.locale('pl');
const localizer = momentLocalizer(moment);

// Custom Toolbar Component - zostanie przeniesiony do MonthView.js
// const CustomToolbar = ({ label, onNavigate, onView, view }) => { ... };

const CalendarPage = ({ clients }) => {
    const [appointments, setAppointments] = useState(() => {
        const storedAppointments = localStorage.getItem('appointments');
        return storedAppointments ? JSON.parse(storedAppointments) : [];
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month'); // New state for current view
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        id: null,
        clientName: '',
        clientId: '',
        date: selectedDate,
        time: format(selectedDate, 'HH:mm'),
        description: '',
        estimatedDuration: 60,
    });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showQuickAddClientModal, setShowQuickAddClientModal] = useState(false); // State for Quick Add Client modal
    const [showAppointmentModal, setShowAppointmentModal] = useState(false); // State for Appointment modal
    const [showClientDrawer, setShowClientDrawer] = useState(false);
    const [drawerClient, setDrawerClient] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }, [appointments]);

    const handleAddOrUpdateAppointment = useCallback((appointmentToSave) => {
        setAppointments(prevAppointments => {
            let updatedAppointments;
            if (appointmentToSave.id) {
                updatedAppointments = prevAppointments.map(app =>
                    app.id === appointmentToSave.id ? appointmentToSave : app
                );
            } else {
                updatedAppointments = [...prevAppointments, { ...appointmentToSave, id: Date.now().toString() }];
            }
            toast.success(`Wizyta ${appointmentToSave.clientName} została ${appointmentToSave.id ? 'zaktualizowana' : 'dodana'}!`);
            return updatedAppointments;
        });
    }, []);

    const handleDeleteAppointment = useCallback((idToDelete) => {
        setAppointments(prevAppointments => {
            const updatedAppointments = prevAppointments.filter(app => app.id !== idToDelete);
            toast.success('Wizyta usunięta pomyślnie!');
            return updatedAppointments;
        });
    }, []);

    // Filtrowanie wizyt na podstawie statusu klienta
    const filteredAppointments = useMemo(() => {
        return appointments.filter(app => {
            if (statusFilter === 'all') return true;
            const client = clients.find(c => c.id === app.clientId);
            return client?.status === statusFilter;
        });
    }, [appointments, clients, statusFilter]);

    const calendarEvents = useMemo(() => {
        return filteredAppointments.map(app => {
            const start = new Date(app.date);
            const [hours, minutes] = app.time.split(':').map(Number);
            start.setHours(hours, minutes, 0, 0);

            const end = addMinutes(start, app.estimatedDuration || 60);

            return {
                id: app.id,
                title: app.clientName,
                start,
                end,
                resource: {
                    id: app.id,
                    clientName: app.clientName,
                    clientId: app.clientId,
                    description: app.description,
                    estimatedDuration: app.estimatedDuration,
                },
            };
        });
    }, [filteredAppointments]);

    const handleSelectSlot = useCallback(({ start, end }) => {
        setSelectedDate(start);
        setNewAppointment(prev => ({
            ...prev,
            id: null,
            date: start,
            time: format(start, 'HH:mm'),
            estimatedDuration: differenceInMinutes(end, start) || 60,
        }));
        setSelectedEvent(null);
        setShowAppointmentForm(true);
        setShowAppointmentModal(true);
        setCurrentView('day'); // Automatically switch to day view on slot select
    }, [selectedDate]);

    const handleSelectEvent = useCallback((event) => {
        setSelectedEvent(event);
        setNewAppointment({
            id: event.resource.id,
            clientName: event.resource.clientName,
            clientId: event.resource.clientId,
            date: event.start,
            time: format(event.start, 'HH:mm'),
            description: event.resource.description,
            estimatedDuration: event.resource.estimatedDuration,
        });
        setDrawerClient(event.resource);
        setShowClientDrawer(true);
        setSelectedDate(event.start); // Set selected date to event date
        setCurrentView('day'); // Automatically switch to day view on event select
    }, []);

    const handleEventDrop = useCallback(({ event, start, end }) => {
        const updatedAppointment = {
            id: event.resource.id,
            clientName: event.title,
            clientId: event.resource.clientId,
            date: start.toISOString(),
            time: format(start, 'HH:mm'),
            description: event.resource.description,
            estimatedDuration: event.resource.estimatedDuration,
        };
        handleAddOrUpdateAppointment(updatedAppointment);
    }, [handleAddOrUpdateAppointment]);

    const handleEventResize = useCallback(({ event, start, end }) => {
        const duration = differenceInMinutes(end, start);
        const updatedAppointment = {
            id: event.resource.id,
            clientName: event.title,
            clientId: event.resource.clientId,
            date: start.toISOString(),
            time: format(start, 'HH:mm'),
            description: event.resource.description,
            estimatedDuration: duration,
        };
        handleAddOrUpdateAppointment(updatedAppointment);
    }, [handleAddOrUpdateAppointment]);

    const handleSubmitAppointment = (e) => {
        e.preventDefault();
        const client = clients.find(c => c.id === newAppointment.clientId);
        if (!client) {
            toast.error('Proszę wybrać klienta.');
            return;
        }

        const appDate = new Date(newAppointment.date);
        const [hours, minutes] = newAppointment.time.split(':').map(Number);
        appDate.setHours(hours, minutes, 0, 0);

        const appointmentToSave = {
            id: newAppointment.id || Date.now().toString(),
            clientName: client.firstName + ' ' + client.lastName,
            clientId: client.id,
            date: appDate.toISOString(),
            time: newAppointment.time,
            description: newAppointment.description,
            estimatedDuration: parseInt(newAppointment.estimatedDuration, 10),
        };
        handleAddOrUpdateAppointment(appointmentToSave);
        setShowAppointmentForm(false);
        setShowAppointmentModal(false);
        setNewAppointment({
            id: null,
            clientName: '',
            clientId: '',
            date: selectedDate,
            time: format(selectedDate, 'HH:mm'),
            description: '',
            estimatedDuration: 60,
        });
        setSelectedEvent(null);
    };

    const handleAppointmentChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment(prev => ({ ...prev, [name]: value }));
    };

    const handleViewChange = useCallback((newView) => {
        setCurrentView(newView);
    }, []);

    // New Modal Component
    const Modal = ({ isOpen, onClose, children }) => {
        return (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    {children}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    };

    const AppointmentForm = ({ newAppointment, handleAppointmentChange, handleSubmitAppointment, selectedEvent, handleDeleteAppointment, setShowAppointmentForm, setSelectedEvent, clients, selectedDate, onClose }) => (
        <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                    {selectedEvent ? 'Edytuj Wizytę' : 'Dodaj Nową Wizytę'}
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
            </div>
            <form onSubmit={handleSubmitAppointment} className="space-y-4">
                <div>
                    <label htmlFor="clientSelect" className="block text-sm font-medium text-gray-700">Wybierz klienta</label>
                    <select
                        id="clientSelect"
                        name="clientId"
                        value={newAppointment.clientId}
                        onChange={handleAppointmentChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    >
                        <option value="">-- Wybierz klienta --</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.firstName} {client.lastName}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">Data</label>
                    <input
                        type="date"
                        id="appointmentDate"
                        name="date"
                        value={newAppointment.date ? format(new Date(newAppointment.date), 'yyyy-MM-dd') : ''}
                        onChange={handleAppointmentChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">Godzina</label>
                    <input
                        type="time"
                        id="appointmentTime"
                        name="time"
                        value={newAppointment.time}
                        onChange={handleAppointmentChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">Szacowany czas trwania (minuty)</label>
                    <input
                        type="number"
                        id="estimatedDuration"
                        name="estimatedDuration"
                        value={newAppointment.estimatedDuration}
                        onChange={handleAppointmentChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Opis wizyty</label>
                    <textarea
                        id="description"
                        name="description"
                        value={newAppointment.description}
                        onChange={handleAppointmentChange}
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    ></textarea>
                </div>
                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                    >
                        {selectedEvent ? 'Zapisz zmiany' : 'Dodaj Wizytę'}
                    </button>
                    {selectedEvent && (
                        <button
                            type="button"
                            onClick={() => {
                                handleDeleteAppointment(selectedEvent.resource.id);
                                setShowAppointmentForm(false);
                                onClose();
                                setSelectedEvent(null);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            Usuń Wizytę
                        </button>
                    )}
                </div>
            </form>
        </div>
    );

    const QuickAddClientForm = ({ clients, selectedDate, setShowQuickAddClientModal, onClose }) => {
        const [newClient, setNewClient] = useState({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            status: 'pending', // Nowa właściwość statusu
        });

        const handleAddClient = (e) => {
            e.preventDefault();
            const existingClients = JSON.parse(localStorage.getItem('clients')) || [];
            const updatedClients = [...existingClients, { ...newClient, id: Date.now().toString() }];
            localStorage.setItem('clients', JSON.stringify(updatedClients));
            toast.success(`Klient ${newClient.firstName} ${newClient.lastName} dodany pomyślnie ze statusem 'oczekujący'!`);
            // Optionally send email here with a link to the full public form
            // emailService.sendClientOnboardingEmail(newClient.email, newClient.firstName, Date.now().toString());
            setNewClient({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                status: 'pending',
            });
            setShowQuickAddClientModal(false);
            onClose();
        };

        const handleClientChange = (e) => {
            const { name, value } = e.target;
            setNewClient(prev => ({ ...prev, [name]: value }));
        };

        return (
            <div className="bg-white rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Szybkie Dodawanie Klienta</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleAddClient} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Imię</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={newClient.firstName}
                            onChange={handleClientChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nazwisko</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={newClient.lastName}
                            onChange={handleClientChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={newClient.phone}
                            onChange={handleClientChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={newClient.email}
                            onChange={handleClientChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Dodaj Klienta
                    </button>
                </form>
            </div>
        );
    };

    const renderCalendarView = () => {
        switch (currentView) {
            case 'month':
                return (
                    <MonthView
                        calendarEvents={calendarEvents}
                        selectedDate={selectedDate}
                        handleSelectEvent={handleSelectEvent}
                        handleSelectSlot={handleSelectSlot}
                        handleEventDrop={handleEventDrop}
                        handleEventResize={handleEventResize}
                        onView={handleViewChange}
                    />
                );
            case 'week':
                return (
                    <WeekView
                        calendarEvents={calendarEvents}
                        selectedDate={selectedDate}
                        handleSelectEvent={handleSelectEvent}
                        handleSelectSlot={handleSelectSlot}
                        handleEventDrop={handleEventDrop}
                        handleEventResize={handleEventResize}
                        onView={handleViewChange}
                    />
                );
            case 'day':
                return (
                    <DayView
                        calendarEvents={calendarEvents}
                        selectedDate={selectedDate}
                        handleSelectEvent={handleSelectEvent}
                        handleSelectSlot={handleSelectSlot}
                        handleEventDrop={handleEventDrop}
                        handleEventResize={handleEventResize}
                        onBackToMonth={() => handleViewChange('month')}
                        onView={handleViewChange}
                    />
                );
            case 'agenda':
                return (
                    <AgendaView
                        calendarEvents={calendarEvents}
                        selectedDate={selectedDate}
                        handleSelectEvent={handleSelectEvent}
                        handleSelectSlot={handleSelectSlot}
                        handleEventDrop={handleEventDrop}
                        handleEventResize={handleEventResize}
                        onView={handleViewChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Kalendarz Spotkań</h1>
                <p className="text-sm text-gray-500">Wybrana data: {format(selectedDate, 'PPP', { locale: pl })}</p>
            </div>

            <ControlPanel
                selectedDate={selectedDate}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onNewAppointment={() => setShowAppointmentModal(true)}
                onQuickAddClient={() => setShowQuickAddClientModal(true)}
            />

            <div className="flex flex-col lg:flex-row gap-6 mt-6 relative">
                <div className="lg:w-2/3">
                    {renderCalendarView()}
                </div>

                {/* Appointment Modal */}
                <Modal isOpen={showAppointmentModal} onClose={() => setShowAppointmentModal(false)}>
                    <AppointmentForm
                        newAppointment={newAppointment}
                        handleAppointmentChange={handleAppointmentChange}
                        handleSubmitAppointment={handleSubmitAppointment}
                        selectedEvent={selectedEvent}
                        handleDeleteAppointment={handleDeleteAppointment}
                        setShowAppointmentForm={setShowAppointmentForm} // Keep for now
                        setSelectedEvent={setSelectedEvent}
                        clients={clients}
                        selectedDate={selectedDate}
                        onClose={() => setShowAppointmentModal(false)} // Pass onClose to close modal
                    />
                </Modal>

                {/* Quick Add Client Modal */}
                <Modal isOpen={showQuickAddClientModal} onClose={() => setShowQuickAddClientModal(false)}>
                    <QuickAddClientForm
                        clients={clients}
                        selectedDate={selectedDate}
                        setShowQuickAddClientModal={setShowQuickAddClientModal}
                        onClose={() => setShowQuickAddClientModal(false)} // Pass onClose to close modal
                    />
                </Modal>

                {/* Client Drawer */}
                {showClientDrawer && (
                    <ClientDrawer
                        client={drawerClient}
                        onClose={() => {
                            setShowClientDrawer(false);
                            setDrawerClient(null);
                        }}
                    />
                )}

            </div>
        </div>
    );
};

export default CalendarPage; 