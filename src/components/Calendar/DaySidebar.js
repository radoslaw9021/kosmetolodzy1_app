import React from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
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
        <div style={{ 
            background: 'rgba(30,28,50,0.85)', 
            borderRadius: '2.2rem', 
            boxShadow: '0 0 60px #a855f7aa, 0 0 0 8px #fff2 inset, 0 8px 48px #a855f7cc', 
            padding: '2.2rem', 
            minWidth: 320, 
            maxWidth: 380,
            color: '#fff'
        }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '2rem',
                padding: '1.2rem 2rem',
                background: 'rgba(40, 30, 60, 0.7)',
                borderRadius: '1.5rem',
                boxShadow: '0 2px 16px #a855f7aa'
            }}>
                <div style={{ 
                    fontWeight: 800, 
                    fontSize: '1.6rem',
                    background: 'linear-gradient(90deg, #a855f7, #6366f1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 4px 20px #a855f7cc'
                }}>
                    {format(validDate, 'd MMMM yyyy', { locale: pl })}
                </div>
                <button
                    onClick={onAddAppointment}
                    style={{ 
                        padding: '0.7rem 1.3rem',
                        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '1.2rem',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 2px 12px #a855f7aa, 0 0 0 2px #fff2 inset',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 4px 20px 0 #a855f7cc, 0 0 0 4px #fff2 inset';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 2px 12px #a855f7aa, 0 0 0 2px #fff2 inset';
                    }}
                >
                    Dodaj Nową Wizytę
                </button>
            </div>
            {appointments.length === 0 && (
                <div style={{ 
                    background: 'rgba(40, 30, 60, 0.7)',
                    color: '#a855f7',
                    borderRadius: '1.5rem',
                    boxShadow: '0 2px 12px #a855f7aa',
                    padding: '1.5rem',
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    marginTop: '1.5rem'
                }}>
                    Brak zaplanowanych wizyt.
                </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {appointments.map((ev, index) => {
                    const isHovered = ev.id === hoveredEventId;
                    const color = getTreatmentColor(ev.resource?.treatment);
                    const isPast = new Date(ev.end) < new Date();

                    const style = {
                        background: isHovered 
                            ? 'linear-gradient(135deg, #a855f7 80%, #6366f1 100%)' 
                            : 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                        borderBottom: index < appointments.length - 1 ? '1px solid #a855f7cc' : 'none',
                        borderLeft: `5px solid ${color}`,
                        padding: '1rem 1.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'background 0.18s, box-shadow 0.18s, transform 0.13s',
                        cursor: 'pointer',
                        opacity: isPast ? 0.65 : 1,
                        borderRadius: '1.1rem',
                        border: '2px solid #fff2',
                        boxShadow: isHovered 
                            ? '0 4px 32px 0 #a855f7cc, 0 0 0 3px #ffffff22 inset' 
                            : '0 4px 20px #a855f7aa, 0 0 0 3px #ffffff22 inset',
                        marginBottom: '1rem',
                        transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                    };

                    return (
                        <div
                            key={ev.id}
                            style={style}
                            onMouseEnter={() => setHoveredEventId(ev.id)}
                            onMouseLeave={() => setHoveredEventId(null)}
                        >
                            <span style={{ 
                                fontSize: '1.5rem', 
                                filter: 'drop-shadow(0 0 6px #a855f7)' 
                            }}>{getServiceIcon(ev.resource?.description)}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0.3rem'
                                }}>
                                    <div style={{ 
                                        fontWeight: 600, 
                                        fontSize: '1rem',
                                        color: '#fff',
                                        lineHeight: '1.3',
                                        letterSpacing: '0.01em'
                                    }}>{ev.title}</div>
                                    <div style={{ 
                                        display: 'flex',
                                        gap: '0.5rem'
                                    }}>
                                        <button onClick={() => onEdit(ev)} style={{ 
                                            background: 'rgba(255, 255, 255, 0.1)', 
                                            border: 'none', 
                                            color: '#fff', 
                                            cursor: 'pointer', 
                                            padding: '0.4rem 0.5rem',
                                            fontSize: '1rem',
                                            transition: '0.2s',
                                            borderRadius: '0.6rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: '2.5rem',
                                            minHeight: '2.5rem'
                                        }} 
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                            e.target.style.transform = 'scale(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                        title="Edytuj">✏️</button>
                                        <button onClick={() => onDelete(ev)} style={{ 
                                            background: 'rgba(255, 255, 255, 0.1)', 
                                            border: 'none', 
                                            color: '#fff', 
                                            cursor: 'pointer', 
                                            padding: '0.4rem 0.5rem',
                                            fontSize: '1rem',
                                            transition: '0.2s',
                                            borderRadius: '0.6rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: '2.5rem',
                                            minHeight: '2.5rem'
                                        }} 
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                            e.target.style.transform = 'scale(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                        title="Usuń">🗑️</button>
                                    </div>
                                </div>
                                <div style={{ 
                                    fontSize: '0.9rem', 
                                    color: 'rgba(255,255,255,0.9)',
                                    marginBottom: '0.3rem'
                                }}>{ev.resource?.description || 'Brak opisu'}</div>
                                <div style={{ 
                                    fontSize: '0.9rem', 
                                    color: '#fff',
                                    fontWeight: 600
                                }}>{format(new Date(ev.start), 'HH:mm')} - {format(new Date(ev.end), 'HH:mm')}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DaySidebar; 