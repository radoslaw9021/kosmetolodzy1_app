import React from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Funkcja do określania ikony na podstawie opisu usługi
const getServiceIcon = (desc) => {
    if (!desc) return '💅';
    const d = desc.toLowerCase();
    if (d.includes('mezoterapia')) return '🧬';
    if (d.includes('oczyszczanie')) return '💧';
    if (d.includes('laser')) return '🔦';
    if (d.includes('peeling')) return '✨';
    if (d.includes('mikrodermabrazja')) return '💎';
    if (d.includes('botoks')) return '💉';
    if (d.includes('kwas')) return '🧪';
    if (d.includes('masaż')) return '💆';
    if (d.includes('konsultacja')) return '👩‍⚕️';
    return '💅';
};

const DaySidebar = ({
    selectedDate,
    appointments,
    onAddAppointment,
    onEdit,
    onDelete
}) => {
    // Zabezpieczenie: upewnij się, że `selectedDate` jest zawsze obiektem Date
    const validDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

    if (isNaN(validDate)) {
        // Obsługa błędu, jeśli data jest nadal nieprawidłowa
        return (
            <div className="card">
                <p>Nieprawidłowa data.</p>
            </div>
        );
    }

    return (
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e5e7eb', padding: 24, minWidth: 320, maxWidth: 380 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 20 }}>
                    {format(validDate, 'd MMMM yyyy', { locale: pl })}
                </div>
                <button
                    onClick={onAddAppointment}
                    className="viewBtn"
                    style={{ background: '#0077cc' }}
                >
                    Dodaj Nową Wizytę
                </button>
            </div>
            {appointments.length === 0 && (
                <div style={{ color: '#888', fontSize: 15, textAlign: 'center', margin: '32px 0' }}>
                    Brak zaplanowanych wizyt.
                </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {appointments.map(ev => (
                    <div key={ev.id} style={{ background: '#f7fafc', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px #e5e7eb' }}>
                        <span style={{ fontSize: 26 }}>{getServiceIcon(ev.resource?.description)}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>{ev.title}</div>
                            <div style={{ fontSize: 13, color: '#555' }}>{ev.resource?.description || 'Brak opisu'}</div>
                            <div style={{ fontSize: 13, color: '#0077cc', marginTop: 2 }}>{format(new Date(ev.start), 'HH:mm')} - {format(new Date(ev.end), 'HH:mm')}</div>
                        </div>
                        <button onClick={() => onEdit(ev)} style={{ background: 'none', border: 'none', color: '#0077cc', cursor: 'pointer', marginRight: 4 }} title="Edytuj"><EditIcon fontSize="small" /></button>
                        <button onClick={() => onDelete(ev)} style={{ background: 'none', border: 'none', color: '#C8373B', cursor: 'pointer' }} title="Usuń"><DeleteIcon fontSize="small" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DaySidebar; 