import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Folder, Eye, Download, Mail, Edit, FileText, Loader, RotateCcw } from 'lucide-react';
import BulkExport from '../components/BulkExport';
import ActivityLogger from '../components/ActivityLogger';
import MigrateLocalClientsButton from '../components/MigrateLocalClientsButton';
import { clientAPI } from '../services/apiService';

const ArchivePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ładowanie danych z API - tylko zarchiwizowanych klientów
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        // Pobierz tylko zarchiwizowane klientki
        const response = await clientAPI.getAll({ archived: true });
        if (response.success) {
          setClients(response.data);
        } else {
          setError('Nie udało się załadować danych');
        }
      } catch (err) {
        console.error('Error loading clients:', err);
        setError('Błąd połączenia z serwerem');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  // Filtrowanie klientek po imieniu, nazwisku, emailu, telefonie
  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter(
      (c) =>
        (c.personalData?.firstName || c.firstName || '').toLowerCase().includes(term) ||
        (c.personalData?.lastName || c.lastName || '').toLowerCase().includes(term) ||
        (c.personalData?.email || c.email || '').toLowerCase().includes(term) ||
        (c.personalData?.phone || c.phone || '').toLowerCase().includes(term)
    );
  }, [search, clients]);

  // Helper: pobierz dane klienta niezależnie od struktury
  const getClientData = (client, field) => {
    return client.personalData?.[field] || client[field] || '';
  };

  // Funkcja odarchiwizacji klientki
  const handleUnarchiveClient = async (clientId, clientName) => {
    if (window.confirm(`Czy na pewno chcesz przywrócić klientkę ${clientName} z archiwum?`)) {
      try {
        const response = await clientAPI.unarchive(clientId);
        
        if (response.success) {
          alert('Klientka została przywrócona z archiwum pomyślnie.');
          // Odśwież listę klientek
          const updatedResponse = await clientAPI.getAll({ archived: true });
          if (updatedResponse.success) {
            setClients(updatedResponse.data);
          }
        } else {
          alert('Błąd podczas przywracania klientki z archiwum.');
        }
      } catch (error) {
        console.error('Error unarchiving client:', error);
        alert('Błąd połączenia z serwerem.');
      }
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <Folder size={32} color="#a855f7" />
          <h1 className="gradient-title">Archiwum klientek</h1>
        </div>
      </header>
      
      <section className="stats">
        {/* Loading state */}
        {loading && (
          <div className="loading-container">
            <Loader size={32} className="animate-spin" />
            <p>Ładowanie danych...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="error-container">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-error"
            >
              Spróbuj ponownie
            </button>
          </div>
        )}

        {/* Content when loaded */}
        {!loading && !error && (
          <>
            {/* Migracja danych lokalnych */}
            <MigrateLocalClientsButton />
            
            {/* Eksport zbiorczy */}
            <BulkExport clients={clients} isAdmin={true} />
            
            {/* Logi aktywności */}
            <ActivityLogger isAdmin={true} />
          </>
        )}
        
        {/* Wyszukiwanie i lista - tylko gdy dane są załadowane */}
        {!loading && !error && (
          <>
            {/* Wyszukiwanie */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Szukaj klientki..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Lista klientek */}
            {filteredClients.length === 0 ? (
              <div className="empty-state">
                Brak zarchiwizowanych klientek spełniających kryteria.
              </div>
            ) : (
              <div className="client-list-container">
                {/* Nagłówek tabeli */}
                <div className="client-list-header">
                  <div className="header-cell">Imię i nazwisko</div>
                  <div className="header-cell">Email</div>
                  <div className="header-cell">Telefon</div>
                  <div className="header-cell">Data archiwizacji</div>
                  <div className="header-cell">Akcje</div>
                </div>
                {/* Wiersze klientek */}
                {filteredClients.map(client => (
                  <div key={client.id} className="client-list-row">
                    <div className="client-cell" data-label="Imię i nazwisko">
                      <span className="client-name">
                        {getClientData(client, 'firstName')} {getClientData(client, 'lastName')}
                      </span>
                    </div>
                    <div className="client-cell" data-label="Email">
                      <span className="client-email">{getClientData(client, 'email')}</span>
                    </div>
                    <div className="client-cell" data-label="Telefon">
                      <span className="client-phone">{getClientData(client, 'phone')}</span>
                    </div>
                    <div className="client-cell" data-label="Data archiwizacji">
                      <span className="client-date">
                        {client.archivedAt ? new Date(client.archivedAt).toLocaleDateString('pl-PL') : '-'}
                      </span>
                    </div>
                    <div className="client-cell" data-label="Akcje">
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => navigate(`/archive/${client.id}`)} 
                        className="btn btn-primary btn-small"
                      >
                        <Eye size={16} />
                        Podgląd
                      </button>
                        <button 
                          onClick={() => handleUnarchiveClient(client.id, `${getClientData(client, 'firstName')} ${getClientData(client, 'lastName')}`)} 
                          className="btn btn-secondary btn-small"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <RotateCcw size={16} />
                          Przywróć
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ArchivePage; 