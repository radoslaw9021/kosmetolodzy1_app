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

import NewsletterPage from "./pages/NewsletterPage";
import CalendarPage from "./pages/CalendarPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // ID bieżącego kosmetologa
  const [currentUserId, setCurrentUserId] = useState(
    localStorage.getItem("userId") || null
  );
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
      if (e.key === "userId") {
        setCurrentUserId(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLoginSuccess = (userId) => {
    setIsLoggedIn(true);
    setCurrentUserId(userId);
    localStorage.setItem("userId", userId);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("userId");
    setCurrentUserId(null);
  };

  // dodaj lub zaktualizuj klientkę (z ownerId)
  const handleAddOrUpdateClient = (clientData, isUpdate) => {
    setClients((prev) => {
      const withOwner = {
        ...clientData,
        ownerId: currentUserId,
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
        isLoggedIn={isLoggedIn}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        clients={clients}
        currentUserId={currentUserId}
        handleAddOrUpdateClient={handleAddOrUpdateClient}
        handleRemoveClient={handleRemoveClient}
        handleUpdateTreatment={handleUpdateTreatment}
      />
    </Router>
  );
}

function AppContent({
  isLoggedIn,
  onLoginSuccess,
  onLogout,
  clients,
  currentUserId,
  handleAddOrUpdateClient,
  handleRemoveClient,
  handleUpdateTreatment,
}) {
  const location = useLocation();
  const isPublicForm = location.pathname === "/ankieta";

  // filtrowana lista dla zalogowanego kosmetologa
  const myClients = clients.filter((c) => c.ownerId === currentUserId);

  return (
    <>
      {!isPublicForm && <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />}
      <main style={isPublicForm ? { padding: 0 } : { padding: "1rem" }}>
        <Routes>
          {/* logowanie */}
          <Route
            path="/login"
            element={<LoginForm onLoginSuccess={onLoginSuccess} />}
          />

          {/* publiczny link do ankiety */}
          <Route
            path="/ankieta"
            element={
              <PublicClientForm
                clientsList={myClients} // TYLKO moi klienci do edycji
                onSubmit={handleAddOrUpdateClient}
              />
            }
          />

          {/* reszta za PrivateRoute */}
          <Route
            path="/clients"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <ClientList
                  clients={myClients} // pokazuję tylko swoich klientów
                  onRemoveClient={handleRemoveClient}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/client/add"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <ClientForm
                  onAddClient={(c) => handleAddOrUpdateClient(c, false)}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/client/:clientId"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <ClientCard
                  clients={myClients}
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
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <TreatmentForm
                  onAddTreatment={(c) => handleAddOrUpdateClient(c, true)}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/client/:clientId/history"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <TreatmentHistory
                  clients={myClients}
                  onUpdateTreatment={handleUpdateTreatment}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/newsletter"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <NewsletterPage clients={myClients} />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to="/clients" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>
    </>
  );
}
