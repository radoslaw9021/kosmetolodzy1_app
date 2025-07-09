import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  Edit, 
  FileText, 
  User, 
  Phone, 
  Mail as MailIcon,
  Calendar,
  Shield,
  Heart,
  FileCheck,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ArchiveClientDetails = ({ clients = [], events = [] }) => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const client = clients.find(c => c.id === clientId);
  
  if (!client) {
    return (
      <div className="dashboard">
        <header>
          <button 
            onClick={() => navigate('/archive')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              background: 'none',
              color: '#a855f7',
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          >
            <ArrowLeft size={20} />
            Powrót do archiwum
          </button>
          <h1>Klientka nie została znaleziona</h1>
        </header>
      </div>
    );
  }

  // Znajdź wizyty dla tej klientki
  const clientEvents = events.filter(event => event.resource?.clientId === clientId);

  // Funkcje akcji (placeholder)
  const handleDownloadPDF = () => {
    setIsLoading(true);
    // TODO: Implementacja eksportu PDF
    setTimeout(() => {
      setIsLoading(false);
      alert('Funkcja eksportu PDF będzie dostępna wkrótce');
    }, 1000);
  };

  const handlePrintConsent = () => {
    setIsLoading(true);
    // TODO: Implementacja wydruku zgody RODO
    setTimeout(() => {
      setIsLoading(false);
      alert('Funkcja wydruku zgody RODO będzie dostępna wkrótce');
    }, 1000);
  };

  const handleSendEmail = () => {
    setIsLoading(true);
    // TODO: Implementacja wysyłki e-mail
    setTimeout(() => {
      setIsLoading(false);
      alert('Funkcja wysyłki e-mail będzie dostępna wkrótce');
    }, 1000);
  };

  const handleEditData = () => {
    navigate(`/client/${clientId}`);
  };

  return (
    <div className="dashboard">
      <header>
        <button 
          onClick={() => navigate('/archive')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: 'none',
            background: 'none',
            color: '#a855f7',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '1rem'
          }}
        >
          <ArrowLeft size={20} />
          Powrót do archiwum
        </button>
        <h1>Dokumentacja klientki: {client.personalData?.firstName || client.firstName} {client.personalData?.lastName || client.lastName}</h1>
      </header>

      <section className="stats">
        {/* Przyciski akcji */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button 
            onClick={handleDownloadPDF}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              background: '#10b981',
              color: 'white',
              padding: '0.7rem 1.2rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            <Download size={18} />
            Pobierz całość (PDF)
          </button>
          
          <button 
            onClick={handlePrintConsent}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              background: '#3b82f6',
              color: 'white',
              padding: '0.7rem 1.2rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            <FileText size={18} />
            Wydrukuj zgodę RODO
          </button>
          
          <button 
            onClick={handleSendEmail}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              background: '#f59e0b',
              color: 'white',
              padding: '0.7rem 1.2rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            <Mail size={18} />
            Wyślij kopię na e-mail
          </button>
          
          <button 
            onClick={handleEditData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              background: '#a855f7',
              color: 'white',
              padding: '0.7rem 1.2rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Edit size={18} />
            Edytuj dane
          </button>
        </div>

        {/* Dane osobowe i kontaktowe */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '1rem', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(168, 85, 247, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#374151' }}>
            <User size={24} color="#a855f7" />
            Dane osobowe i kontaktowe
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Imię:</strong> {client.personalData?.firstName || client.firstName || '-'}
            </div>
            <div>
              <strong>Nazwisko:</strong> {client.personalData?.lastName || client.lastName || '-'}
            </div>
            <div>
              <strong>Email:</strong> {client.personalData?.email || client.email || '-'}
            </div>
            <div>
              <strong>Telefon:</strong> {client.personalData?.phone || client.phone || '-'}
            </div>
            <div>
              <strong>Data urodzenia:</strong> {client.personalData?.dateOfBirth || client.birthDate || '-'}
            </div>
            <div>
              <strong>Płeć:</strong> {client.gender === 'female' ? 'Kobieta' : client.gender === 'male' ? 'Mężczyzna' : '-'}
            </div>
          </div>
        </div>

        {/* Zgody */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '1rem', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(168, 85, 247, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#374151' }}>
            <Shield size={24} color="#a855f7" />
            Zgody
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {client.rodoConsent ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ef4444" />}
              <strong>Zgoda RODO:</strong> {client.rodoConsent ? 'Tak' : 'Nie'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {client.marketingConsent ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ef4444" />}
              <strong>Zgoda marketingowa:</strong> {client.marketingConsent ? 'Tak' : 'Nie'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {client.unsubscribed ? <XCircle size={20} color="#ef4444" /> : <CheckCircle size={20} color="#10b981" />}
              <strong>Rezygnacja z newslettera:</strong> {client.unsubscribed ? 'Tak' : 'Nie'}
            </div>
          </div>
        </div>

        {/* Dane medyczne */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '1rem', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(168, 85, 247, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#374151' }}>
            <Heart size={24} color="#a855f7" />
            Dane medyczne i kosmetologiczne
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Choroby przewlekłe:</strong> {client.chronicDiseases || '-'}
            </div>
            <div>
              <strong>Leki:</strong> {client.medications || '-'}
            </div>
            <div>
              <strong>Suplementy:</strong> {client.supplements || '-'}
            </div>
            <div>
              <strong>Alergie:</strong> {client.allergies || '-'}
            </div>
            <div>
              <strong>Uwagi dodatkowe:</strong> {client.additionalNotes || '-'}
            </div>
          </div>
        </div>

        {/* Historia zabiegów */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '1rem', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(168, 85, 247, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#374151' }}>
            <Calendar size={24} color="#a855f7" />
            Historia zabiegów
          </h2>
          {clientEvents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {clientEvents.map(event => (
                <div key={event.id} style={{ 
                  padding: '0.8rem', 
                  background: '#f9fafb', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontWeight: 600, color: '#374151' }}>
                    {event.resource?.treatment || 'Brak nazwy zabiegu'}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    {format(new Date(event.start), 'dd.MM.yyyy HH:mm', { locale: pl })} - {format(new Date(event.end), 'HH:mm', { locale: pl })}
                  </div>
                  {event.resource?.description && (
                    <div style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                      {event.resource.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
              Brak historii zabiegów.
            </div>
          )}
        </div>

        {/* Podpis (placeholder) */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '1rem', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(168, 85, 247, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#374151' }}>
            <FileCheck size={24} color="#a855f7" />
            Podpis klientki
          </h2>
          {(() => {
            const signatures = JSON.parse(localStorage.getItem('signatures') || '[]');
            const clientSignature = signatures.find(s => s.clientId === client.id);
            
            if (clientSignature) {
              return (
                <div style={{ textAlign: 'center' }}>
                  <img 
                    src={clientSignature.data} 
                    alt="Podpis klientki" 
                    style={{ 
                      maxWidth: '300px', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem',
                      background: '#fff'
                    }} 
                  />
                  <div style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    Podpis z dnia: {new Date(clientSignature.signedAt).toLocaleDateString('pl-PL')}
                  </div>
                </div>
              );
            } else {
              return (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  Brak zapisanego podpisu elektronicznego.
                </div>
              );
            }
          })()}
        </div>
      </section>
    </div>
  );
};

export default ArchiveClientDetails; 