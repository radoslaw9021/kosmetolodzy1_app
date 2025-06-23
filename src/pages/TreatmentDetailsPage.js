import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { getTreatmentColor } from '../utils/calendarUtils';
import TreatmentForm from '../components/TreatmentForm';

export default function TreatmentDetailsPage({ events, clients, onUpdateTreatment }) {
  const { clientId, treatmentId } = useParams();
  const navigate = useNavigate();

  const client = clients.find(c => c.id === clientId);
  const treatmentEvent = events.find(e => e.id.toString() === treatmentId);

  const [showForm, setShowForm] = useState(false);

  if (!client || !treatmentEvent) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Nie znaleziono zabiegu lub klienta.</h2>
        <button onClick={() => navigate(`/client/${clientId}`)} style={{ marginTop: 16 }}>← Powrót do klienta</button>
      </div>
    );
  }

  // Przygotuj dane do edycji (pełny zakres pól)
  const initialData = {
    type: treatmentEvent.resource?.treatment || '',
    date: format(new Date(treatmentEvent.start), 'yyyy-MM-dd'),
    notesInternal: treatmentEvent.resource?.notesInternal || '',
    notesForClient: treatmentEvent.resource?.notesForClient || '',
    recommendationsText: (treatmentEvent.resource?.recommendations || []).join('\n'),
    images: treatmentEvent.resource?.images || [],
  };

  return (
    <div style={{ maxWidth: 600, margin: '2.5rem auto', background: '#fff', borderRadius: 24, boxShadow: '0 8px 40px 0 rgba(80,80,80,0.08)', padding: 32 }}>
      <button onClick={() => navigate(`/client/${clientId}`)} style={{ marginBottom: 18, background: '#eee', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer' }}>← Powrót do klienta</button>
      <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 8 }}>Szczegóły zabiegu</h2>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', background: getTreatmentColor(treatmentEvent.resource?.treatment) }}></span>
        <span style={{ fontWeight: 600 }}>{treatmentEvent.resource?.treatment || 'Brak nazwy'}</span>
      </div>
      <div style={{ color: '#666', marginBottom: 18 }}>
        Data: {format(new Date(treatmentEvent.start), 'd MMMM yyyy, HH:mm', { locale: pl })}
      </div>
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setShowForm(f => !f)} style={{ background: '#232323', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600 }}>
          {showForm ? 'Anuluj edycję' : 'Edytuj szczegóły zabiegu'}
        </button>
      </div>
      {showForm && (
        <TreatmentForm
          initialData={initialData}
          onAddTreatment={(updated) => {
            onUpdateTreatment(clientId, updated, treatmentEvent.id);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      {/* Można tu dodać podgląd zdjęć, notatek, zaleceń, historię zmian itd. */}
    </div>
  );
} 