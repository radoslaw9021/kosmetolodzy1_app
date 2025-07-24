import React, { useState } from 'react';
import { Download, FileText, Users, Shield, AlertCircle } from 'lucide-react';
import { exportAPI } from '../services/apiService';

const BulkExport = ({ clients = [], isAdmin = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [exportType, setExportType] = useState('pdf');
  const [selectedClients, setSelectedClients] = useState([]);

  // Sprawdź uprawnienia
  if (!isAdmin) {
    return (
      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#dc2626'
      }}>
        <Shield size={20} />
        <span>Eksport zbiorczy dostępny tylko dla administratorów.</span>
      </div>
    );
  }

  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(c => c.id));
    }
  };

  const handleSelectClient = (clientId) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const handleExport = async () => {
    if (selectedClients.length === 0) {
      alert('Wybierz przynajmniej jedną klientkę do eksportu.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await exportAPI.bulkExport({
          clientIds: selectedClients,
          format: exportType // 'pdf' lub 'zip'
      });

      if (response.success) {
        // Pobierz blob z odpowiedzi
        const blob = response.blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eksport_klientek_${new Date().toISOString().split('T')[0]}.${exportType}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      alert(`Eksport zakończony pomyślnie. Pobrano plik: eksport_klientek_${new Date().toISOString().split('T')[0]}.${exportType}`);
      } else {
        throw new Error(response.message || 'Błąd eksportu');
      }
    } catch (error) {
      alert('Błąd podczas eksportu: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 2px 8px rgba(168, 85, 247, 0.1)',
      border: '1px solid #f3f4f6'
    }}>
      <h2 style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        marginBottom: '1rem', 
        color: '#374151' 
      }}>
        <Users size={24} color="#a855f7" />
        Eksport zbiorczy klientek
      </h2>

      <div style={{ 
        background: '#f0f9ff', 
        border: '1px solid #bae6fd', 
        borderRadius: '0.5rem', 
        padding: '1rem', 
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <AlertCircle size={20} color="#0ea5e9" />
        <span style={{ color: '#0c4a6e', fontSize: '0.875rem' }}>
          Eksport zbiorczy jest dostępny tylko dla administratorów. Wszystkie operacje są logowane.
        </span>
      </div>

      {/* Wybór typu eksportu */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
          Typ eksportu:
        </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
            <input
              type="radio"
              value="pdf"
              checked={exportType === 'pdf'}
              onChange={(e) => setExportType(e.target.value)}
            />
            <FileText size={16} />
            PDF
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
            <input
              type="radio"
              value="zip"
              checked={exportType === 'zip'}
              onChange={(e) => setExportType(e.target.value)}
            />
            <Download size={16} />
            ZIP
          </label>
        </div>
      </div>

      {/* Lista klientek do wyboru */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '0.5rem',
          padding: '0.5rem',
          background: '#f9fafb',
          borderRadius: '0.5rem'
        }}>
          <input
            type="checkbox"
            checked={selectedClients.length === clients.length}
            onChange={handleSelectAll}
          />
          <span style={{ fontWeight: 600, color: '#374151' }}>
            Wybierz wszystkie ({clients.length} klientek)
          </span>
        </div>

        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          border: '1px solid #e5e7eb', 
          borderRadius: '0.5rem',
          background: '#f9fafb'
        }}>
          {clients.map(client => (
            <div key={client.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.5rem',
              borderBottom: '1px solid #e5e7eb',
              background: selectedClients.includes(client.id) ? '#f3f4f6' : 'transparent'
            }}>
              <input
                type="checkbox"
                checked={selectedClients.includes(client.id)}
                onChange={() => handleSelectClient(client.id)}
              />
              <span style={{ color: '#374151' }}>
                {client.firstName} {client.lastName}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                ({client.email})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Przycisk eksportu */}
      <button
        onClick={handleExport}
        disabled={isLoading || selectedClients.length === 0}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: 'none',
          background: selectedClients.length > 0 ? '#10b981' : '#9ca3af',
          color: 'white',
          padding: '0.7rem 1.2rem',
          borderRadius: '0.5rem',
          fontWeight: 600,
          cursor: selectedClients.length > 0 && !isLoading ? 'pointer' : 'not-allowed',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        <Download size={18} />
        {isLoading ? 'Eksportuję...' : `Eksportuj wybrane (${selectedClients.length})`}
      </button>

      {selectedClients.length > 0 && (
        <div style={{ 
          marginTop: '0.5rem', 
          fontSize: '0.875rem', 
          color: '#6b7280' 
        }}>
          Wybrano {selectedClients.length} z {clients.length} klientek
        </div>
      )}
    </div>
  );
};

export default BulkExport; 