// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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

import { getCurrentUser, setCurrentUser, isAdmin } from "./services/userService";

export default function App() {
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());
  const [clients, setClients] = useState(() => {
    const stored = localStorage.getItem("clients");
    return stored ? JSON.parse(stored) : [];
  });

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

  const handleLoginSuccess = (user) => {
    setCurrentUserState(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUserState(null);
    setCurrentUser(null);
  };

  // dodaj lub zaktualizuj klientkę (z ownerId)
  const handleAddOrUpdateClient = (clientData, isUpdate) => {
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
  const handleUpdateTreatment = (clientId, updatedTreatment, idx) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              treatments: c.treatments.map((t, i) =>
                i === idx ? updatedTreatment : t
              ),
            }
          : c
      )
    );
  };

  return (
    <Router>
      <AppContent
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        clients={clients}
        handleAddOrUpdateClient={handleAddOrUpdateClient}
        handleRemoveClient={handleRemoveClient}
        handleUpdateTreatment={handleUpdateTreatment}
      />
    </Router>
  );
}

function AppContent({
  currentUser,
  onLoginSuccess,
  onLogout,
  clients,
  handleAddOrUpdateClient,
  handleRemoveClient,
  handleUpdateTreatment,
}) {
  const location = useLocation();
  const isPublicForm = location.pathname === "/ankieta";

  // Filtrowanie klientów według roli użytkownika
  const filteredClients = isAdmin(currentUser) 
    ? clients // Admin widzi wszystkich klientów
    : clients.filter((c) => c.ownerId === currentUser?.id); // Kosmetolog widzi tylko swoich

  return (
    <>
      {!isPublicForm && <Header currentUser={currentUser} onLogout={onLogout} />}
      <main style={isPublicForm ? { padding: 0 } : { padding: "1rem" }}>
        <Routes>
          {/* logowanie */}
          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/clients" /> : <LoginForm onLoginSuccess={onLoginSuccess} />
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
                <CalendarPage clients={filteredClients} />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to="/clients" />}
          />
        </Routes>
      </main>
    </>
  );
}
