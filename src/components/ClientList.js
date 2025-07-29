import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { sendNewsletterEmail } from "../services/emailService";
import { User, Mail, Phone, Calendar, Eye, Plus, Search, Send } from "lucide-react";

export default function ClientList({ clients }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");

  // filtrowanie klientów
  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter(
      (c) =>
        c.firstName.toLowerCase().includes(term) ||
        c.lastName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term)
    );
  }, [searchTerm, clients]);

  // helper: data ostatniego zabiegu
  const getLastTreatmentDate = (treatments = []) => {
    if (!treatments.length) return "-";
    const dates = treatments.map((t) => t.date).filter(Boolean);
    if (!dates.length) return "-";
    
    const lastDate = dates.reduce((a, b) => (a > b ? a : b));
    try {
      const date = new Date(lastDate);
      return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return "-";
    }
  };

  // helper: generuj avatar z inicjałów
  const getClientAvatar = (firstName, lastName) => {
    const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    return initials || '?';
  };

  // helper: status klientki
  const getClientStatus = (client) => {
    if (!client.treatments || client.treatments.length === 0) return 'new';
    const lastTreatment = new Date(getLastTreatmentDate(client.treatments));
    const now = new Date();
    const daysSinceLastTreatment = Math.floor((now - lastTreatment) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastTreatment <= 30) return 'active';
    if (daysSinceLastTreatment <= 90) return 'inactive';
    return 'inactive';
  };

  // helper: status text
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktywna';
      case 'inactive': return 'Nieaktywna';
      case 'new': return 'Nowa';
      default: return 'Nieznany';
    }
  };

  // wyślij link do formularza klientce
  const handleSendInvite = () => {
    if (!inviteEmail.trim()) {
      setInviteStatus("Podaj adres e-mail ❌");
      return;
    }
    const link = `${window.location.origin}/client/add?ref=${Date.now()}`;
    const message =
      `Dzień dobry,\n\n` +
      `Proszę o wypełnienie karty klientki online:\n${link}\n\n` +
      `Pozdrawiam,\nBeauty Room by Joanna Wójcik`;

    sendNewsletterEmail({
      to_name: "",
      to_email: inviteEmail.trim(),
      subject: "Prośba o wypełnienie karty klientki",
      message,
    })
      .then(() => setInviteStatus("Link został wysłany ✅"))
      .catch(() => setInviteStatus("Błąd wysyłki ❌"));
  };

  return (
    <div className="client-list-container card">
      <div className="client-list-header flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="gradient-title" style={{ fontSize: '2.1rem', fontWeight: 700, margin: 0 }}>Lista klientek</h2>
        <button className="btn btn-primary" onClick={() => navigate('/client/add')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} />
          Dodaj klientkę
        </button>
      </div>
      <div className="client-list-search flex" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a855f7' }} />
          <input
            className="input-dark"
            type="text"
            placeholder="Szukaj klientki..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <button className="btn btn-secondary" onClick={() => setShowInviteForm(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Send size={18} />
          {showInviteForm ? 'Anuluj' : 'Wyślij link'}
        </button>
      </div>
      {showInviteForm && (
        <div className="client-list-invite flex" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a855f7' }} />
            <input
              className="input-dark"
              type="email"
              placeholder="Adres e-mail klientki"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSendInvite} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={18} />
            Wyślij
          </button>
          {inviteStatus && <span className="status-msg">{inviteStatus}</span>}
        </div>
      )}
      <div className="client-list-table-wrapper">
        <table className="client-list-grid">
          <thead className="client-list-grid-header">
            <tr>
              <th>Awatar</th>
              <th>Imię</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Ostatni zabieg</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr className="client-list-grid-row">
                <td className="client-list-grid-cell" colSpan="6" style={{textAlign: 'center'}}>Brak klientek</td>
              </tr>
            ) : (
              filteredClients.map(client => (
                <tr className="client-list-grid-row" key={client.id}>
                  <td className="client-list-grid-cell">
                    <div className="client-avatar">{getClientAvatar(client.firstName, client.lastName)}</div>
                  </td>
                  <td className="client-list-grid-cell">
                    <span style={{ fontWeight: 600 }}>{client.firstName} {client.lastName}</span>
                  </td>
                  <td className="client-list-grid-cell email">{client.email}</td>
                  <td className="client-list-grid-cell phone">
                    <Phone size={14} style={{ color: '#a855f7', marginRight: '0.5rem' }} />
                    {client.phone}
                  </td>
                  <td className="client-list-grid-cell last-visit">
                    <Calendar size={14} style={{ color: '#a855f7', marginRight: '0.5rem' }} />
                    {getLastTreatmentDate(client.treatments)}
                  </td>
                  <td className="client-list-grid-cell button">
                    <button className="btn-secondary btn-gradient" onClick={() => navigate(`/client/${client.id}`)}>
                      <Eye size={16} /> Podgląd
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
