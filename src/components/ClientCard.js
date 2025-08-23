import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { getTreatmentColor } from "../utils/calendarUtils";
import { Trash2 } from "lucide-react";
import TreatmentForm from "./TreatmentForm";
import TreatmentHistory from "./TreatmentHistory";
import ClientFormView from "./ClientFormView";
import TreatmentConsentModal from "./TreatmentConsentModal";
import AppointmentConfirmationModal from "./AppointmentConfirmationModal";
import { clientAPI, treatmentAPI, appointmentAPI } from "../services/apiService";
import treatmentConsentService from "../services/treatmentConsentService";

// Premium UI - wszystkie style w theme.css

export default function ClientCard({ clients, events, appointmentStatuses, onUpdateClient, onRemoveClient, onUpdateTreatment }) {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasValidConsent, setHasValidConsent] = useState(false);
  const [showAppointmentConfirmationModal, setShowAppointmentConfirmationModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const client = clients.find((c) => c.id === clientId);

  // Find and sort appointments for this client
  const clientAppointments = events && Array.isArray(events) 
    ? events
        .filter((event) => event && event.resource?.clientId === clientId)
        .sort((a, b) => new Date(b.start) - new Date(a.start))
    : [];

  // Sprawdź czy klient ma ważną zgodę na zabieg
  useEffect(() => {
    if (client) {
      treatmentConsentService.hasValidConsent(client.id)
        .then(hasConsent => {
          setHasValidConsent(hasConsent);
        })
        .catch(error => {
          console.log('Błąd podczas sprawdzania zgody:', error.message);
          setHasValidConsent(false);
        });
    }
  }, [client]);



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

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
    });
  }, [client.firstName, client.lastName, client.email, client.phone]);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback(() => {
    onUpdateClient({ ...client, ...form });
    setIsEditing(false);
  }, [client, form, onUpdateClient]);

  // avatar initials
  const getInitials = useCallback((name, surname) =>
    (name?.[0] || "").toUpperCase() + (surname?.[0] || "").toUpperCase(), []);

  // Premium UI - hover effects w CSS
  // --- DODAJ TO DO TWOJEGO PLIKU ---
  // Funkcja do aktualizacji JEDNEGO zabiegu klientki
  const handleUpdateTreatment = useCallback((clientId, updatedTreatment, treatmentIdx) => {
    // Sprawdź czy klientka się zgadza
    if (!client || client.id !== clientId) return;
    const updatedTreatments = [...(client.treatments || [])];
    updatedTreatments[treatmentIdx] = updatedTreatment;
    onUpdateClient({ ...client, treatments: updatedTreatments });
  }, [client, onUpdateClient]);

  // Funkcja do przejścia do szczegółów wizyty
  const handleGoToAppointment = useCallback((event) => {
    navigate(`/client/${clientId}/treatment/${event.id}`);
  }, [clientId, navigate]);

  // NOWE FUNKCJE - Obsługa modalu zatwierdzania wizyt
  const handleAppointmentClick = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentConfirmationModal(true);
  }, []);

  const handleConfirmVisit = useCallback(async (appointment) => {
    try {
      await appointmentAPI.confirmByExternal(appointment.id);
      // Status będzie zaktualizowany przez App.js
    } catch (error) {
      console.error('Błąd podczas potwierdzania wizyty:', error);
      throw error;
    }
  }, []);

  const handleCancelVisit = useCallback(async (appointment) => {
    try {
      await appointmentAPI.cancelByExternal(appointment.id);
      // Status będzie zaktualizowany przez App.js
    } catch (error) {
      console.error('Błąd podczas anulowania wizyty:', error);
      throw error;
    }
  }, []);

  const handleEditTreatment = useCallback(async (appointment) => {
    try {
      console.log('Przechodzę do edycji zabiegu:', appointment);
      
      // Przejdź do strony edycji zabiegu
      navigate(`/client/${clientId}/treatment/${appointment.id}/edit`);
      
    } catch (error) {
      console.error('Błąd podczas przechodzenia do edycji:', error);
      throw error; // Przekazujemy błąd do modalu
    }
  }, [clientId, navigate]);

  const handleReturnToClient = useCallback(() => {
    setShowAppointmentConfirmationModal(false);
    setSelectedAppointment(null);
  }, []);

  // Funkcja usuwania klienta
  const handleDeleteClient = useCallback(() => {
    if (window.confirm(`Czy na pewno chcesz usunąć klientkę ${client.firstName} ${client.lastName}? Ta operacja jest nieodwracalna.`)) {
      onRemoveClient(client.id);
      navigate('/clients');
    }
  }, [client.firstName, client.lastName, client.id, onRemoveClient, navigate]);

  // Jeśli modal zatwierdzania wizyty jest otwarty, pokaż tylko modal
  if (showAppointmentConfirmationModal && selectedAppointment) {
    return (
      <AppointmentConfirmationModal
        isOpen={showAppointmentConfirmationModal}
        onClose={() => setShowAppointmentConfirmationModal(false)}
        appointment={selectedAppointment}
        onConfirmVisit={handleConfirmVisit}
        onCancelVisit={handleCancelVisit}
        onEditTreatment={handleEditTreatment}
        onReturnToClient={handleReturnToClient}
      />
    );
  }

  return (
    <div className="client-card-container">
      <div className="client-card-header">
        <div className="client-card-avatar">{getInitials(client.firstName, client.lastName)}</div>
        <div className="client-card-title-section">
          <h2 className="client-card-title">{client.firstName} {client.lastName}</h2>
          {hasValidConsent && (
            <div className="consent-status-badge">
              ✅ Zgoda na zabieg
            </div>
          )}
        </div>
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
        {clientAppointments && clientAppointments.length > 0 ? (
          <div className="client-card-appointments-list">
            {clientAppointments.map(event => {
              if (!event || !event.id) return null;
              
              try {
                const isPast = event.start && event.end ? new Date(event.end) < new Date() : false;
                const color = event.resource?.treatment ? getTreatmentColor(event.resource.treatment) : '#a855f7';
                
                // Sprawdź status wizyty - domyślnie 'completed' jeśli jest przeszła, inaczej 'pending'
                const appointmentStatus = appointmentStatuses[event.id] || (isPast ? 'completed' : 'pending');
                
                // Określ tekst statusu
                const getStatusText = (status) => {
                  switch (status) {
                    case 'completed': return 'Odbyta';
                    case 'cancelled': return 'Anulowana';
                    case 'pending': return 'Zaplanowana';
                    default: return isPast ? 'Odbyta' : 'Zaplanowana';
                  }
                };
                
                // Określ kolor statusu
                const getStatusColor = (status) => {
                  switch (status) {
                    case 'completed': return '#28a745';
                    case 'cancelled': return '#dc2626';
                    case 'pending': return '#f59e0b';
                    default: return isPast ? '#888' : '#28a745';
                  }
                };
                
                return (
                  <div 
                    key={event.id} 
                    onClick={() => handleAppointmentClick(event)}
                    className="client-card-appointment-item cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderLeft: `4px solid ${color}` }}
                  >
                    <span 
                      className="client-card-appointment-dot"
                      style={{ 
                        backgroundColor: color, 
                        opacity: appointmentStatus === 'cancelled' ? 0.3 : 1,
                        border: appointmentStatus === 'cancelled' ? '2px solid #dc2626' : 'none'
                      }}
                    ></span>
                    <div className="client-card-appointment-content" style={{ opacity: appointmentStatus === 'cancelled' ? 0.6 : 1 }}>
                      <div className="client-card-appointment-title">{event.resource?.treatment || 'Brak nazwy'}</div>
                      <div className="client-card-appointment-date">
                        {event.start ? format(new Date(event.start), 'd MMMM yyyy, HH:mm', { locale: pl }) : 'Brak daty'}
                      </div>
                    </div>
                    <span 
                      className="client-card-appointment-status" 
                      style={{ 
                        color: getStatusColor(appointmentStatus),
                        textDecoration: appointmentStatus === 'cancelled' ? 'line-through' : 'none',
                        fontWeight: appointmentStatus === 'cancelled' ? 'normal' : 'bold'
                      }}
                    >
                      {appointmentStatus === 'cancelled' && '❌ '}
                      {appointmentStatus === 'completed' && '✅ '}
                      {appointmentStatus === 'pending' && '⏰ '}
                      {getStatusText(appointmentStatus)}
                    </span>
                  </div>
                );
              } catch (error) {
                console.error('Błąd podczas renderowania wizyty:', error, event);
                return null;
              }
            })}
          </div>
        ) : (
          <p className="client-card-empty-state">Brak zapisanych wizyt.</p>
        )}
        
        {/* Historia zabiegów */}
        <div className="client-card-section-subtitle">Historia zabiegów</div>
        <TreatmentHistory
          treatments={client.treatments || []}
          clientId={client.id}
          onUpdateTreatment={onUpdateTreatment}
          onAddTreatment={async (newTreatment) => {
            try {
              // Sprawdź czy użytkownik jest zalogowany
              if (!localStorage.getItem('authToken')) {
                alert('Musisz być zalogowany, aby dodać zabieg');
                return;
              }
              
              console.log('🚀 Dodawanie zabiegu po wizycie:', newTreatment);
              
              const treatmentData = {
                clientId: client.id,
                type: newTreatment.type,
                date: newTreatment.date,
                notesInternal: newTreatment.notesInternal,
                notesForClient: newTreatment.notesForClient,
                recommendations: newTreatment.recommendations,
                images: newTreatment.images
              };
              
              console.log('📤 Dane wysyłane do API:', treatmentData);
              
              // Sprawdź czy clientId jest prawidłowy
              if (!client.id || client.id === 'undefined' || client.id === 'null') {
                alert('Błąd: Nieprawidłowy ID klienta');
                return;
              }
              
              const response = await treatmentAPI.add(treatmentData);
              
              if (response.success) {
                console.log('✅ Zabieg dodany pomyślnie po wizycie:', response.data);
                
                // Odśwież dane klienta z API
                const clientResponse = await clientAPI.getById(client.id);
                if (clientResponse.success) {
                  onUpdateClient(clientResponse.data);
                }
              } else {
                console.error('❌ Błąd dodawania zabiegu po wizycie:', response);
                alert('Błąd podczas dodawania zabiegu');
              }
            } catch (error) {
              console.error('❌ Błąd dodawania zabiegu po wizycie:', error);
              alert('Błąd połączenia z serwerem');
            }
          }}
        />
      </div>

      {/* Informacje medyczne */}
      <div className="client-card-section">
        <div className="client-card-section-title">Informacje medyczne</div>
        <div className="client-card-info-row"><span className="client-card-label">Choroby przewlekłe:</span> {client.medical?.chronicDiseases || '-'}</div>
        <div className="client-card-info-row"><span className="client-card-label">Uwagi:</span> {client.medical?.additionalNotes || '-'}</div>
      </div>

      {/* Styl życia */}
      <div className="client-card-section">
        <div className="client-card-section-title">Styl życia</div>
        <div className="client-card-info-row"><span className="client-card-label">Leki:</span> {client.medical?.medications || '-'}</div>
        <div className="client-card-info-row"><span className="client-card-label">Suplementy:</span> {client.medical?.supplements || '-'}</div>
        <div className="client-card-info-row"><span className="client-card-label">Alergie:</span> {client.medical?.allergies || '-'}</div>
      </div>

      {/* Zgody */}
      <div className="client-card-section">
        <div className="client-card-section-title">Zgody</div>
        <div className="client-card-info-row"><span className="client-card-label">Zgoda RODO:</span> {client.consents?.rodo ? '✓' : '✗'}</div>
        <div className="client-card-info-row"><span className="client-card-label">Zgoda na newsletter:</span> {client.consents?.newsletter ? '✓' : '✗'}</div>
        <div className="client-card-info-row"><span className="client-card-label">Rezygnacja z newslettera:</span> {client.consents?.unsubscribed ? '✓' : '✗'}</div>
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
          onClick={() => setShowConsentModal(true)}
        >
          Zgoda na zabieg
        </button>
        <button
          className="client-card-btn"
          onClick={() => navigate('/calendar', { state: { showAppointmentForm: true, clientId: client.id }})}
        >
          Dodaj wizytę
        </button>
        <button
          className="client-card-btn-danger"
          onClick={handleDeleteClient}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Trash2 size={16} />
          Usuń
        </button>
      </div>

      {/* Formularz zabiegów */}
      {showForm && (
        <TreatmentForm
          onAddTreatment={async (newTreatment) => {
            try {
              // Sprawdź czy użytkownik jest zalogowany
              if (!localStorage.getItem('authToken')) {
                alert('Musisz być zalogowany, aby dodać zabieg');
                return;
              }
              
              console.log('🚀 Dodawanie zabiegu:', newTreatment);
              console.log('👤 Klient:', client);
              console.log('🆔 Client ID:', client.id, 'Type:', typeof client.id);
              
              const treatmentData = {
                clientId: client.id,
                type: newTreatment.type,
                date: newTreatment.date,
                notesInternal: newTreatment.notesInternal,
                notesForClient: newTreatment.notesForClient,
                recommendations: newTreatment.recommendations,
                images: newTreatment.images
              };
              
              console.log('📤 Dane wysyłane do API:', treatmentData);
              console.log('🔑 Token:', localStorage.getItem('authToken'));
              
              // Sprawdź czy clientId jest prawidłowy
              if (!client.id || client.id === 'undefined' || client.id === 'null') {
                alert('Błąd: Nieprawidłowy ID klienta');
                return;
              }
              
              const response = await treatmentAPI.add(treatmentData);
              
              if (response.success) {
                console.log('✅ Zabieg dodany pomyślnie:', response.data);
                
                // Odśwież dane klienta z API
                const clientResponse = await clientAPI.getById(client.id);
                if (clientResponse.success) {
                  onUpdateClient(clientResponse.data);
                }
                
                setShowForm(false);
              } else {
                console.error('❌ Błąd dodawania zabiegu:', response);
                alert('Błąd podczas dodawania zabiegu');
              }
            } catch (error) {
              console.error('❌ Błąd dodawania zabiegu:', error);
              alert('Błąd połączenia z serwerem');
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Przyciski nawigacji */}
      <div className="client-card-navigation">
        <button className="client-card-btn-secondary" onClick={() => navigate('/clients')}>
          Powrót do listy
        </button>
      </div>

      {/* Modal zgody na zabieg */}
      <TreatmentConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        client={client}
        onSave={(consentData) => {
          console.log('Zgoda na zabieg zapisana:', consentData);
          // Można tutaj dodać logikę aktualizacji klienta
        }}
        onPrint={() => {
          console.log('Drukowanie zgody na zabieg');
        }}
      />
    </div>
  );
}
