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
    onDelete,
    hoveredEventId,
    setHoveredEventId,
    getTreatmentColor
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {appointments.map((ev, index) => {
                    const isHovered = ev.id === hoveredEventId;
                    const color = getTreatmentColor(ev.resource?.treatment);
                    const isPast = new Date(ev.end) < new Date();

                    const style = {
                        background: isHovered ? '#f0f8ff' : '#fff',
                        borderBottom: index < appointments.length - 1 ? '1px solid #f0f0f0' : 'none',
                        borderLeft: `5px solid ${color}`,
                        padding: '16px 8px 16px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'background-color 0.2s, opacity 0.2s',
                        cursor: 'pointer',
                        opacity: isPast ? 0.65 : 1,
                    };

                    return (
                        <div
                            key={ev.id}
                            style={style}
                            onMouseEnter={() => setHoveredEventId(ev.id)}
                            onMouseLeave={() => setHoveredEventId(null)}
                        >
                            <span style={{ fontSize: 26 }}>{getServiceIcon(ev.resource?.description)}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 15 }}>{ev.title}</div>
                                <div style={{ fontSize: 13, color: '#555' }}>{ev.resource?.description || 'Brak opisu'}</div>
                                <div style={{ fontSize: 13, color: '#0077cc', marginTop: 2 }}>{format(new Date(ev.start), 'HH:mm')} - {format(new Date(ev.end), 'HH:mm')}</div>
                            </div>
                            <button onClick={() => onEdit(ev)} style={{ background: 'none', border: 'none', color: '#0077cc', cursor: 'pointer', padding: '8px' }} title="Edytuj"><EditIcon /></button>
                            <button onClick={() => onDelete(ev)} style={{ background: 'none', border: 'none', color: '#C8373B', cursor: 'pointer', padding: '8px' }} title="Usuń"><DeleteIcon /></button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DaySidebar; 