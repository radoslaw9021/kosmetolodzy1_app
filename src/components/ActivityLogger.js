import React, { useState, useEffect } from 'react';
import { Clock, User, Download, FileText, Shield, Eye, Trash2 } from 'lucide-react';

const ActivityLogger = ({ isAdmin = false }) => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Pobierz logi z localStorage
    const exportLogs = JSON.parse(localStorage.getItem('exportLogs') || '[]');
    const signatureLogs = JSON.parse(localStorage.getItem('signatures') || '[]').map(sig => ({
      timestamp: sig.signedAt,
      type: 'signature',
      user: 'client',
      details: `Podpis elektroniczny - ${sig.clientId}`,
      clientId: sig.clientId
    }));
    
    const allLogs = [...exportLogs, ...signatureLogs].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    setLogs(allLogs);
  }, []);

  const clearLogs = () => {
    if (window.confirm('Czy na pewno chcesz wyczyścić wszystkie logi?')) {
      localStorage.removeItem('exportLogs');
      localStorage.removeItem('signatures');
      setLogs([]);
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'bulk_export':
        return <Download size={16} color="#10b981" />;
      case 'signature':
        return <FileText size={16} color="#3b82f6" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'bulk_export':
        return '#10b981';
      case 'signature':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

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
        <span>Logi aktywności dostępne tylko dla administratorów.</span>
      </div>
    );
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 2px 8px rgba(168, 85, 247, 0.1)',
      border: '1px solid #f3f4f6'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem' 
      }}>
        <h2 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: '#374151',
          margin: 0
        }}>
          <Clock size={24} color="#a855f7" />
          Logi aktywności
        </h2>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.3rem 0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #e5e7eb',
              fontSize: '0.875rem'
            }}
          >
            <option value="all">Wszystkie operacje</option>
            <option value="bulk_export">Eksporty</option>
            <option value="signature">Podpisy</option>
          </select>
          
          <button
            onClick={clearLogs}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              border: 'none',
              background: '#ef4444',
              color: 'white',
              padding: '0.3rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={14} />
            Wyczyść
          </button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          padding: '2rem',
          background: '#f9fafb',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          Brak logów aktywności.
        </div>
      ) : (
        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          background: '#f9fafb'
        }}>
          {filteredLogs.map((log, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.8rem',
              borderBottom: index < filteredLogs.length - 1 ? '1px solid #e5e7eb' : 'none',
              background: '#fff'
            }}>
              {getLogIcon(log.type)}
              
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 600, 
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  {log.type === 'bulk_export' ? 'Eksport zbiorczy' : 'Podpis elektroniczny'}
                </div>
                <div style={{ 
                  color: '#6b7280', 
                  fontSize: '0.75rem',
                  marginTop: '0.2rem'
                }}>
                  {log.details || `${log.clientCount || 1} klientka`}
                </div>
              </div>
              
              <div style={{ 
                color: '#6b7280', 
                fontSize: '0.75rem',
                textAlign: 'right'
              }}>
                <div>{new Date(log.timestamp).toLocaleDateString('pl-PL')}</div>
                <div>{new Date(log.timestamp).toLocaleTimeString('pl-PL')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '0.5rem', 
        fontSize: '0.75rem', 
        color: '#6b7280',
        textAlign: 'center'
      }}>
        Łącznie {filteredLogs.length} operacji
      </div>
    </div>
  );
};

export default ActivityLogger; 