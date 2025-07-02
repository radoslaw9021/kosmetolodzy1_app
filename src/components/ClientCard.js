import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { getTreatmentColor } from "../utils/calendarUtils";
import TreatmentForm from "./TreatmentForm";
import TreatmentHistory from "./TreatmentHistory";
import ClientFormView from "./ClientFormView";

// Premium UI - wszystkie style w theme.css

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
      <div className="client-card-container">
        <p>Nie znaleziono klientki o podanym ID.</p>
        <button onClick={() => navigate("/clients")} className="client-card-btn-secondary">
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

  // Premium UI - hover effects w CSS
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
    <div className="client-card-container">
      <div className="client-card-header">
        <div className="client-card-avatar">{getInitials(client.firstName, client.lastName)}</div>
        <h2 className="client-card-title">{client.firstName} {client.lastName}</h2>
        <div className="client-card-email-phone">
          <span>{client.email}</span>
          <span>{client.phone}</span>
        </div>
      </div>

      {/* Dane osobowe - z trybem edycji */}
      <div className="client-card-section">
        <div className="client-card-section-title">Dane osobowe</div>
        {isEditing ? (
          <>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleFormChange}
              placeholder="Imię"
              className="client-card-input"
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleFormChange}
              placeholder="Nazwisko"
              className="client-card-input"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleFormChange}
              placeholder="E-mail"
              className="client-card-input"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleFormChange}
              placeholder="Telefon"
              className="client-card-input"
            />
            <div className="client-card-button-group">
              <button className="client-card-btn" onClick={handleSave}>
                Zapisz
              </button>
              <button className="client-card-btn-secondary" onClick={() => setIsEditing(false)}>
                Anuluj
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="client-card-info-row"><span className="client-card-label">Imię:</span> {client.firstName}</div>
            <div className="client-card-info-row"><span className="client-card-label">Nazwisko:</span> {client.lastName}</div>
            <div className="client-card-info-row"><span className="client-card-label">Email:</span> {client.email}</div>
            <div className="client-card-info-row"><span className="client-card-label">Telefon:</span> {client.phone}</div>
            <div className="client-card-button-group">
              <button className="client-card-btn" onClick={handleEdit}>
                Edytuj dane klientki
              </button>
              <button className="client-card-btn-secondary" onClick={() => setShowFullForm((v) => !v)}>
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

      {/* Historia wizyt */}
      <div className="client-card-section">
        <div className="client-card-section-title">Historia wizyt</div>
        {clientAppointments.length > 0 ? (
          <div className="client-card-appointments-list">
            {clientAppointments.map(event => {
              const isPast = new Date(event.end) < new Date();
              const color = getTreatmentColor(event.resource?.treatment);
              return (
                <div 
                  key={event.id} 
                  onClick={() => handleGoToAppointment(event)}
                  className="client-card-appointment-item"
                >
                  <span 
                    className="client-card-appointment-dot"
                    style={{ backgroundColor: color, opacity: isPast ? 0.5 : 1 }}
                  ></span>
                  <div className="client-card-appointment-content" style={{ opacity: isPast ? 0.6 : 1 }}>
                    <div className="client-card-appointment-title">{event.resource?.treatment || 'Brak nazwy'}</div>
                    <div className="client-card-appointment-date">
                      {format(new Date(event.start), 'd MMMM yyyy, HH:mm', { locale: pl })}
                    </div>
                  </div>
                  <span className="client-card-appointment-status" style={{ color: isPast ? '#888' : '#28a745' }}>
                    {isPast ? 'Odbyta' : 'Zaplanowana'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="client-card-empty-state">Brak zapisanych wizyt.</p>
        )}
      </div>

      {/* Informacje medyczne */}
      <div className="client-card-section">
        <div className="client-card-section-title">Informacje medyczne</div>
        <div className="client-card-info-row"><span className="client-card-label">Choroby przewlekłe:</span> {client.chronicDiseases || '-'}</div>
        <div className="client-card-info-row"><span className="client-card-label">Uwagi:</span> {client.additionalNotes || '-'}</div>
      </div>

      {/* Styl życia */}
      <div className="client-card-section">
        <div className="client-card-section-title">Styl życia</div>
        <div className="client-card-info-row"><span className="client-card-label">Leki:</span> {client.medications || '-'}</div>
        <div className="client-card-info-row"><span className="client-card-label">Suplementy:</span> {client.supplements || '-'}</div>
        <div className="client-card-info-row"><span className="client-card-label">Alergie:</span> {client.allergies || '-'}</div>
      </div>

      {/* Zgody */}
      <div className="client-card-section">
        <div className="client-card-section-title">Zgody</div>
        <div className="client-card-info-row"><span className="client-card-label">Zgoda RODO:</span> {client.rodoConsent ? '✓' : '✗'}</div>
        <div className="client-card-info-row"><span className="client-card-label">Zgoda na newsletter:</span> {client.marketingConsent ? '✓' : '✗'}</div>
        <div className="client-card-info-row"><span className="client-card-label">Rezygnacja z newslettera:</span> {client.unsubscribed ? '✓' : '✗'}</div>
      </div>

      {/* Przyciski akcji */}
      <div className="client-card-actions">
        <button 
          className="client-card-btn"
          onClick={() => setShowForm(p => !p)}
        >
          {showForm ? "Anuluj zabieg" : "Dodaj zabieg"}
        </button>
        <button
          className="client-card-btn"
          onClick={() => navigate('/calendar', { state: { showAppointmentForm: true, clientId: client.id }})}
        >
          Dodaj wizytę
        </button>
      </div>

      {/* Formularz zabiegów */}
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

      {/* Historia zabiegów */}
      <div className="client-card-section">
        <div className="client-card-section-title">Historia zabiegów (z formularzy)</div>
        <TreatmentHistory
          treatments={client.treatments || []}
          clientId={client.id}
          onUpdateTreatment={onUpdateTreatment}
        />
      </div>

      {/* Przyciski nawigacji */}
      <div className="client-card-navigation">
        <button className="client-card-btn-secondary" onClick={() => navigate('/clients')}>
          Powrót do listy
        </button>
      </div>
    </div>
  );
}
