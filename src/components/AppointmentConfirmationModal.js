import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { CheckCircle, XCircle, Edit, ArrowLeft, Loader2 } from 'lucide-react';

export default function AppointmentConfirmationModal({
  isOpen,
  onClose,
  appointment,
  onConfirmVisit,
  onCancelVisit,
  onEditTreatment,
  onReturnToClient
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [actionType, setActionType] = useState(null);
  const backButtonRef = useRef();

  // Reset states when modal opens
  useEffect(() => {
    if (appointment) {
      setError(null);
      setSuccessMessage('');
      setActionType(null);
      setIsLoading(false);
    }
  }, [appointment]);

  // Focus management
  useEffect(() => {
    if (appointment) {
      backButtonRef.current?.focus();
    }
  }, [appointment]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onReturnToClient();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onReturnToClient]);

  if (!appointment) {
    return null;
  }

  // Data validation
  const isValidAppointment = appointment && 
    appointment.resource?.treatment && 
    appointment.start;

  if (!isValidAppointment) {
    return (
      <div className="fixed inset-0 z-50 bg-[#1b1624] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-[2.2rem] relative overflow-hidden">
          <div 
            className="absolute inset-0 rounded-[2.2rem]"
            style={{
              background: 'rgba(30,28,50,0.85)',
              boxShadow: '0 0 60px 0 #a855f7aa, 0 0 0 8px #fff2 inset, 0 8px 48px #a855f7cc'
            }}
          ></div>
          <div className="relative z-10 p-8 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Błąd danych</h2>
            <p className="text-white mb-6">Nieprawidłowe dane wizyty. Sprawdź czy wszystkie informacje są dostępne.</p>
            <button
              onClick={onReturnToClient}
              className="px-6 py-3 bg-[#a855f7] text-white rounded-lg hover:bg-[#9333ea] transition-colors"
            >
              Powrót do klienta
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirmVisit = async () => {
    setError(null);
    setActionType('confirm');
    setIsLoading(true);
    
    try {
      await onConfirmVisit(appointment);
      setSuccessMessage('✅ Wizyta została potwierdzona!');
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      setError('Nie udało się potwierdzić wizyty. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelVisit = async () => {
    if (!window.confirm('Czy na pewno chcesz anulować wizytę? Ta akcja nie może być cofnięta.')) {
      return;
    }

    setError(null);
    setActionType('cancel');
    setIsLoading(true);
    
    try {
      await onCancelVisit(appointment);
      setSuccessMessage('❌ Wizyta została anulowana!');
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      setError('Nie udało się anulować wizyty. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTreatment = async () => {
    setError(null);
    setActionType('edit');
    setIsLoading(true);
    
    try {
      await onEditTreatment(appointment);
      setSuccessMessage('✏️ Przechodzę do edycji zabiegu...');
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setError('Nie udało się otworzyć edycji. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1b1624] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-[2.2rem] relative overflow-hidden">
        {/* Glowing border effect - taki sam jak w client-card */}
        <div 
          className="absolute inset-0 rounded-[2.2rem]"
          style={{
            background: 'rgba(30,28,50,0.85)',
            boxShadow: '0 0 60px 0 #a855f7aa, 0 0 0 8px #fff2 inset, 0 8px 48px #a855f7cc'
          }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Przycisk powrotu */}
          <button
            onClick={onReturnToClient}
            className="absolute top-6 left-6 text-white hover:text-purple-200 transition-colors p-3 rounded-full hover:bg-opacity-20 hover:bg-purple-500"
            ref={backButtonRef}
          >
            <ArrowLeft size={24} />
          </button>

          {/* Nagłówek */}
          <div className="text-center mb-8 pt-4">
            <h2 
              className="text-3xl font-bold text-white mb-2"
              style={{
                background: 'linear-gradient(90deg, #a855f7, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Potwierdzenie wizyty
            </h2>
          </div>

          {/* Informacje o wizycie */}
          <div 
            className="mb-8 rounded-[1.5rem] p-6"
            style={{
              background: 'rgba(40, 30, 60, 0.7)',
              boxShadow: '0 1px 12px 0 #a855f7aa'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-6 h-6 rounded-full shadow-lg"
                style={{ backgroundColor: appointment.color || '#a855f7' }}
              ></div>
              <div>
                <div className="font-semibold text-xl text-white">
                  {appointment.resource?.treatment || 'Brak nazwy zabiegu'}
                </div>
                <div className="text-lg" style={{ color: '#b6b6d6' }}>
                  {format(new Date(appointment.start), 'd MMMM yyyy, HH:mm', { locale: pl })}
                </div>
              </div>
            </div>
          </div>

          {/* Przyciski akcji */}
          <div className="space-y-4">
            <button
              onClick={handleConfirmVisit}
              className="w-full flex items-center justify-center gap-3 text-white font-semibold py-4 px-6 rounded-[1.5rem] transition-all duration-200 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 2px 16px #10b981aa'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <CheckCircle size={24} />
                  <span className="text-lg">Wizyta się odbyła</span>
                </>
              )}
            </button>

            <button
              onClick={handleCancelVisit}
              className="w-full flex items-center justify-center gap-3 text-white font-semibold py-4 px-6 rounded-[1.5rem] transition-all duration-200 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                boxShadow: '0 2px 16px #dc2626aa'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <XCircle size={24} />
                  <span className="text-lg">Wizyta nie odbyła się</span>
                </>
              )}
            </button>

            <button
              onClick={handleEditTreatment}
              className="w-full flex items-center justify-center gap-3 text-white font-semibold py-4 px-6 rounded-[1.5rem] transition-all duration-200 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 60%, #ec4899 100%)',
                boxShadow: '0 2px 16px #a855f7aa'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #9333ea 0%, #7c3aed 60%, #db2777 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #6366f1 60%, #ec4899 100%)';
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Edit size={24} />
                  <span className="text-lg">Edytuj szczegóły zabiegu</span>
                </>
              )}
            </button>
          </div>

          {/* Success/Error messages */}
          {successMessage && (
            <div className="mt-6 text-center p-4 rounded-xl font-semibold animate-slideInUp"
                 style={{
                   background: 'rgba(16, 185, 129, 0.1)',
                   color: '#10b981',
                   border: '1px solid rgba(16, 185, 129, 0.3)'
                 }}>
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mt-6 text-center p-4 rounded-xl font-semibold animate-slideInUp"
                 style={{
                   background: 'rgba(220, 38, 38, 0.1)',
                   color: '#dc2626',
                   border: '1px solid rgba(220, 38, 38, 0.3)'
                 }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
