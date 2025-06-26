// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import LoginForm from "./components/Auth/LoginForm";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Header from "./components/Header";

import ClientList from "./components/ClientList";
import ClientForm from "./components/ClientForm";
import ClientCard from "./components/ClientCard";
import TreatmentForm from "./components/TreatmentForm";
import TreatmentHistory from "./components/TreatmentHistory";
import PublicClientForm from "./components/PublicClientForm";
import AdminPanel from "./components/AdminPanel";

import NewsletterPage from "./pages/NewsletterPage";
import CalendarPage from "./pages/CalendarPage";
import DashboardPage from './pages/DashboardPage';
import TreatmentDetailsPage from './pages/TreatmentDetailsPage';

import { getCurrentUser, setCurrentUser, isAdmin } from "./services/userService";
import { 
  addAppointmentToClient, 
  updateAppointment, 
  deleteAppointment,
  getAppointmentsForUser,
  getUpcomingAppointments 
} from "./services/userService";

export default function App() {
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());
  const [clients, setClients] = useState(() => {
    const stored = localStorage.getItem("clients");
    let parsedClients = [];
    if (stored) {
      try {
        parsedClients = JSON.parse(stored);
      } catch (e) {
        console.error("Błąd parsowania klientów z localStorage:", e);
        // W przypadku błędu, zacznij z pustą listą, aby uniknąć awarii
        parsedClients = [];
      }
    }
    
    // Migracja: dodaj pole appointments do istniejących klientów
    const migratedClients = parsedClients.map(client => ({
      ...client,
      appointments: client.appointments || []
    }));
    
    if (stored && JSON.stringify(parsedClients) !== JSON.stringify(migratedClients)) {
      localStorage.setItem("clients", JSON.stringify(migratedClients));
    }
    
    return migratedClients;
  });

  // JEDYNE ŹRÓDŁO PRAWDY O WIZYTACH
  const [events, setEvents] = useState(() => {
    try {
        const stored = localStorage.getItem('appointments');
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.map(e => ({
                ...e,
                start: new Date(e.start),
                end: new Date(e.end),
            }));
        }
    } catch (error) {
        console.error("Błąd wczytywania wizyt z localStorage", error);
    }
    return [];
  });

  // synchronizacja wizyt z localStorage
  useEffect(() => {
      localStorage.setItem('appointments', JSON.stringify(events));
  }, [events]);

  // synchronizacja localStorage <-> stan
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "clients") {
        setClients(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Motyw: light/dark
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLoginSuccess = (user) => {
    setCurrentUserState(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUserState(null);
    setCurrentUser(null);
  };

  // dodaj lub zaktualizuj klientkę (z ownerId)
  const handleAddOrUpdateClient = (clientData, isUpdate = false) => {
    setClients((prev) => {
      const withOwner = {
        ...clientData,
        ownerId: currentUser?.id,
      };
      const next = isUpdate
        ? prev.map((c) => (c.id === withOwner.id ? withOwner : c))
        : [...prev, withOwner];
      localStorage.setItem("clients", JSON.stringify(next));
      return next;
    });
  };

  // usuń klientkę
  const handleRemoveClient = (id) => {
    setClients((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem("clients", JSON.stringify(next));
      return next;
    });
  };

  // aktualizacja zabiegu
  const handleUpdateTreatment = (clientId, updatedTreatment, eventId) => {
    // 1. Aktualizuj klienta (treatments)
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              treatments: c.treatments.map((t, i) =>
                // Porównaj po dacie i typie, bo nie ma id zabiegu
                t.date === updatedTreatment.date && t.type === updatedTreatment.type
                  ? updatedTreatment
                  : t
              ),
            }
          : c
      )
    );

    // 2. Aktualizuj event w kalendarzu (events)
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId || ev.id?.toString() === eventId?.toString()) {
          return {
            ...ev,
            resource: {
              ...ev.resource,
              treatment: updatedTreatment.type,
              notesInternal: updatedTreatment.notesInternal,
              notesForClient: updatedTreatment.notesForClient,
              recommendations: updatedTreatment.recommendations,
              images: updatedTreatment.images,
            },
          };
        }
        return ev;
      })
    );
  };

  // ===== FUNKCJE DO ZARZĄDZANIA WIZYTAMI =====
  
  // dodaj wizytę do klienta
  const handleAddAppointment = (clientId, appointmentData) => {
    addAppointmentToClient(clientId, appointmentData, clients, setClients);
  };

  // aktualizuj wizytę
  const handleUpdateAppointment = (clientId, appointmentId, updatedData) => {
    updateAppointment(clientId, appointmentId, updatedData, clients, setClients);
  };

  // usuń wizytę
  const handleDeleteAppointment = (clientId, appointmentId) => {
    deleteAppointment(clientId, appointmentId, clients, setClients);
  };

  // pobierz wizyty dla użytkownika
  const getUserAppointments = (userId) => {
    return getAppointmentsForUser(userId, clients);
  };

  // pobierz nadchodzące wizyty
  const getUpcomingUserAppointments = (userId) => {
    return getUpcomingAppointments(userId, clients);
  };

  return (
    <Router>
      <AppContent
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        clients={clients}
        setClients={setClients}
        events={events}
        setEvents={setEvents}
        handleAddOrUpdateClient={handleAddOrUpdateClient}
        handleRemoveClient={handleRemoveClient}
        handleUpdateTreatment={handleUpdateTreatment}
        handleAddAppointment={handleAddAppointment}
        handleUpdateAppointment={handleUpdateAppointment}
        handleDeleteAppointment={handleDeleteAppointment}
        getUserAppointments={getUserAppointments}
        getUpcomingUserAppointments={getUpcomingUserAppointments}
        theme={theme}
        setTheme={setTheme}
      />
    </Router>
  );
}

function AppContent({
  currentUser,
  onLoginSuccess,
  onLogout,
  clients,
  setClients,
  events,
  setEvents,
  handleAddOrUpdateClient,
  handleRemoveClient,
  handleUpdateTreatment,
  handleAddAppointment,
  handleUpdateAppointment,
  handleDeleteAppointment,
  getUserAppointments,
  getUpcomingUserAppointments,
  theme,
  setTheme,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isPublicForm = location.pathname === "/ankieta";

  // Filtrowanie klientów według roli użytkownika
  const filteredClients = isAdmin(currentUser) 
    ? clients // Admin widzi wszystkich klientów
    : clients.filter((c) => c.ownerId === currentUser?.id); // Kosmetolog widzi tylko swoich

  return (
    <>
      {!isPublicForm && <Header currentUser={currentUser} onLogout={onLogout} theme={theme} setTheme={setTheme} />}
      <main style={isPublicForm ? { padding: 0 } : { padding: "1rem" }}>
        <Routes>
          {/* logowanie */}
          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/dashboard" /> : <LoginForm onLoginSuccess={onLoginSuccess} />
            }
          />

          {/* publiczny link do ankiety */}
          <Route
            path="/ankieta"
            element={
              <PublicClientForm
                clientsList={filteredClients}
                onSubmit={handleAddOrUpdateClient}
              />
            }
          />

          {/* Panel administracyjny - tylko dla adminów */}
          <Route
            path="/admin"
            element={
              <PrivateRoute isLoggedIn={!!currentUser}>
                {isAdmin(currentUser) ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/clients" />
                )}
              </PrivateRoute>
            }
          />

          {/* reszta za PrivateRoute */}
          <Route
            path="/clients"
            element={
              <PrivateRoute isLoggedIn={!!currentUser}>
                <ClientList
                  clients={filteredClients}
                  onRemoveClient={handleRemoveClient}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/client/add"
            element={
              <PrivateRoute isLoggedIn={!!currentUser}>
                <ClientForm
                  onAddClient={(c) => handleAddOrUpdateClient(c, false)}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/client/:clientId"
            element={
              <PrivateRoute isLoggedIn={!!currentUser}>
                <ClientCard
                  clients={filteredClients}
                  events={events}
                  onRemoveClient={handleRemoveClient}
                  onUpdateClient={(c) => handleAddOrUpdateClient(c, true)}
                  onUpdateTreatment={handleUpdateTreatment}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/client/:clientId/treatment/add"
            element={
              <PrivateRoute isLoggedIn={!!currentUser}>
                <TreatmentForm
                  onAddTreatment={(c) => handleAddOrUpdateClient(c, true)}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/client/:clientId/treatments"
            element={
              <PrivateRoute isLoggedIn={!!currentUser}>
                <TreatmentHistory
                  clients={filteredClients}
                  onUpdateTreatment={handleUpdateTreatment}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/client/:clientId/treatment/:treatmentId"
            element={
              <PrivateRoute isLoggedIn={!!currentUser}>
                <TreatmentDetailsPage
                  events={events}
                  clients={clients}
                  onUpdateTreatment={handleUpdateTreatment}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/newsletter"
            element={
              <PrivateRoute isLoggedIn={!!currentUser}>
                <NewsletterPage clients={filteredClients} />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute isLoggedIn={!!currentUser}>
                <CalendarPage
                  clients={filteredClients}
                  events={events}
                  setEvents={setEvents}
                  onAddClient={(newClient) => handleAddOrUpdateClient(newClient, false)}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                events={events}
                clients={clients}
                onAddAppointment={() => navigate('/calendar')}
                onAddClient={() => navigate('/clients')}
                onGoToCalendar={() => navigate('/calendar')}
              />
            }
          />
          <Route
            path="/"
            element={<Navigate to="/dashboard" />}
          />
        </Routes>
      </main>
    </>
  );
}
