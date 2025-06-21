import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { getTreatmentColor } from "../utils/calendarUtils";
import TreatmentForm from "./TreatmentForm";
import TreatmentHistory from "./TreatmentHistory";
import ClientFormView from "./ClientFormView";

// USTAWIAMY KOLORY
const BLACK = "#232323";
const BLACK_HOVER = "#111";

const style = {
  container: {
    maxWidth: "600px",
    margin: "2.5rem auto",
    padding: "2rem",
    background: "#fff",
    borderRadius: "2rem",
    boxShadow:
      "0 8px 40px 0 rgba(80,80,80,0.08), 0 1.5px 7px 0 rgba(80,80,80,0.06)",
    fontFamily: "'Inter', 'Montserrat', Arial, sans-serif",
    color: BLACK,
    position: "relative",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "2rem",
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "#f5f5f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.4rem",
    color: BLACK,
    marginBottom: "0.5rem",
    fontWeight: 700,
    letterSpacing: ".01em",
    boxShadow: "0 1px 6px 0 rgba(0,0,0,0.04)",
  },
  h2: {
    fontWeight: 700,
    fontSize: "2rem",
    letterSpacing: "-0.01em",
    margin: 0,
    textAlign: "center",
  },
  emailPhone: {
    display: "flex",
    gap: "1.2rem",
    color: "#888",
    fontSize: "1rem",
    marginTop: "0.2rem",
    justifyContent: "center",
  },
  section: {
    margin: "1.7rem 0",
    padding: "1.3rem 1.5rem",
    background: "#f8f9fb",
    borderRadius: "1rem",
    boxShadow: "0 1px 8px 0 rgba(0,0,0,0.025)",
  },
  infoRow: { marginBottom: "0.6rem", fontSize: "1.09rem" },
  label: { color: "#8d99ae", fontWeight: 500, marginRight: "0.4em" },
  buttonGroup: { marginTop: "1.2rem", display: "flex", gap: "1rem" },
  blackButton: {
    padding: "0.6rem 1.2rem",
    background: BLACK,
    color: "#fff",
    border: "none",
    borderRadius: "1.4rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 2px 8px 0 rgba(40,40,40,0.08)",
    transition: "background .18s, transform .12s",
  },
  secondaryButton: {
    padding: "0.6rem 1.2rem",
    background: "#f8f9fb",
    color: BLACK,
    border: "none",
    borderRadius: "1.4rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "none",
    transition: "background .18s, transform .12s",
  },
  backButton: {
    padding: "0.6rem 1.2rem",
    background: "#e5e7eb",
    color: "#222",
    border: "none",
    borderRadius: "1.4rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background .2s",
  },
  input: {
    width: "100%",
    padding: "0.7rem",
    marginBottom: "0.7rem",
    border: "1px solid #e5e7eb",
    borderRadius: "1rem",
    fontSize: "1.04rem",
    outline: "none",
    background: "#f7f8fa",
    fontFamily: "inherit",
    transition: "border .18s",
  },
  emailStatus: (error) => ({
    marginTop: "1.1rem",
    color: error ? "#DC3545" : BLACK,
    fontWeight: 600,
    textAlign: "center",
    fontSize: "1.05rem",
  }),
};

export default function ClientCard({ clients, events, onUpdateClient, onRemoveClient, onUpdateTreatment }) {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const client = clients.find((c) => c.id === clientId);

  // Find and sort appointments for this client
  const clientAppointments = events
    .filter((event) => event.resource?.clientId === clientId)
    .sort((a, b) => new Date(b.start) - new Date(a.start));

  if (!client) {
    return (
      <div style={{ padding: "1rem" }}>
        <p>Nie znaleziono klientki o podanym ID.</p>
        <button onClick={() => navigate("/clients")} style={style.backButton}>
          ← Powrót do listy
        </button>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdateClient({ ...client, ...form });
    setIsEditing(false);
  };

  // avatar initials
  const getInitials = (name, surname) =>
    (name?.[0] || "").toUpperCase() + (surname?.[0] || "").toUpperCase();

  // Hover effect for black buttons
  const handleButtonHover = (e) => {
    e.currentTarget.style.background = BLACK_HOVER;
    e.currentTarget.style.transform = "scale(1.04)";
  };
  const handleButtonOut = (e) => {
    e.currentTarget.style.background = BLACK;
    e.currentTarget.style.transform = "scale(1)";
  };
  // --- DODAJ TO DO TWOJEGO PLIKU ---
  // Funkcja do aktualizacji JEDNEGO zabiegu klientki
  const handleUpdateTreatment = (clientId, updatedTreatment, treatmentIdx) => {
    // Sprawdź czy klientka się zgadza
    if (!client || client.id !== clientId) return;
    const updatedTreatments = [...(client.treatments || [])];
    updatedTreatments[treatmentIdx] = updatedTreatment;
    onUpdateClient({ ...client, treatments: updatedTreatments });
  };

  const handleGoToAppointment = (event) => {
    navigate(`/client/${clientId}/treatment/${event.id}`);
  };

  return (
    <div style={style.container}>
      <div style={style.header}>
        <div style={style.avatar}>
          {getInitials(client.firstName, client.lastName)}
        </div>
        <h2 style={style.h2}>
          {client.firstName} {client.lastName}
        </h2>
        <div style={style.emailPhone}>
          <span>{client.email}</span>
          <span>{client.phone}</span>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => navigate("/clients")} style={style.backButton}>
            ← Powrót do listy
          </button>
        </div>
      </div>

      <div style={style.section}>
        <h3
          style={{
            fontSize: "1.15rem",
            marginBottom: "1.2rem",
            fontWeight: 700,
            color: BLACK, // nagłówek czarny
            letterSpacing: ".01em",
          }}
        >
          Dane klientki
        </h3>
        {isEditing ? (
          <>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleFormChange}
              placeholder="Imię"
              style={style.input}
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleFormChange}
              placeholder="Nazwisko"
              style={style.input}
            />
            <input
              name="email"
              value={form.email}
              onChange={handleFormChange}
              placeholder="E-mail"
              style={style.input}
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleFormChange}
              placeholder="Telefon"
              style={style.input}
            />
            <div style={style.buttonGroup}>
              <button
                onClick={handleSave}
                style={style.blackButton}
                onMouseOver={handleButtonHover}
                onMouseOut={handleButtonOut}
              >
                Zapisz
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={style.secondaryButton}
              >
                Anuluj
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={style.infoRow}>
              <span style={style.label}>Imię:</span> {client.firstName}
            </div>
            <div style={style.infoRow}>
              <span style={style.label}>Nazwisko:</span> {client.lastName}
            </div>
            <div style={style.infoRow}>
              <span style={style.label}>E-mail:</span> {client.email}
            </div>
            <div style={style.infoRow}>
              <span style={style.label}>Telefon:</span> {client.phone}
            </div>
            <div style={style.buttonGroup}>
              <button
                onClick={handleEdit}
                style={style.blackButton}
                onMouseOver={handleButtonHover}
                onMouseOut={handleButtonOut}
              >
                Edytuj dane klientki
              </button>
              <button
                onClick={() => setShowFullForm((v) => !v)}
                style={style.secondaryButton}
              >
                {showFullForm ? "Ukryj formularz" : "Podejrzyj formularz"}
              </button>
            </div>
            {showFullForm && (
              <div style={{ marginTop: "1rem" }}>
                <ClientFormView client={client} />
              </div>
            )}
          </>
        )}
      </div>

      <div style={style.section}>
        <h3 style={{ fontSize: "1.15rem", marginBottom: "1rem", fontWeight: 700 }}>
          Historia wizyt
        </h3>
        {clientAppointments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {clientAppointments.map(event => {
              const isPast = new Date(event.end) < new Date();
              const color = getTreatmentColor(event.resource?.treatment);
              return (
                <div 
                  key={event.id} 
                  onClick={() => handleGoToAppointment(event)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.8rem 0.5rem',
                    borderBottom: '1px solid #f5f5f7',
                    cursor: 'pointer',
                    transition: 'background .18s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fb'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    marginRight: '1rem',
                    opacity: isPast ? 0.5 : 1,
                  }}></span>
                  <div style={{ flex: 1, opacity: isPast ? 0.6 : 1 }}>
                    <div style={{ fontWeight: 600 }}>{event.resource?.treatment || 'Brak nazwy'}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {format(new Date(event.start), 'd MMMM yyyy, HH:mm', { locale: pl })}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: isPast ? '#888' : '#28a745',
                  }}>
                    {isPast ? 'Odbyta' : 'Zaplanowana'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#888', padding: '1rem 0' }}>Brak zapisanych wizyt.</p>
        )}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button 
              onClick={() => setShowForm(p => !p)}
              style={style.blackButton}
              onMouseOver={handleButtonHover}
              onMouseOut={handleButtonOut}
          >
              {showForm ? "Anuluj zabieg" : "Dodaj zabieg"}
          </button>
          <button 
              onClick={() => navigate('/calendar', { state: { showAppointmentForm: true, clientId: client.id }})}
              style={style.blackButton}
              onMouseOver={handleButtonHover}
              onMouseOut={handleButtonOut}
          >
              Dodaj wizytę
          </button>
      </div>

      {showForm && (
        <TreatmentForm
            onAddTreatment={(newTreatment) => {
            const updatedClient = {
                ...client,
                treatments: [...(client.treatments || []), newTreatment],
            };
            onUpdateClient(updatedClient);
            setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
        />
      )}

      <div style={{ marginTop: "2.3rem" }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 700, borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            Historia zabiegów (z formularzy)
        </h3>
        <TreatmentHistory
            treatments={client.treatments || []}
            clientId={client.id}
            onUpdateTreatment={onUpdateTreatment}
        />
      </div>

    </div>
  );
}
