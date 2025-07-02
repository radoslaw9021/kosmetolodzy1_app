import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Smartphone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Calendar,
  Plus,
  Trash2,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';

const SMSManager = ({ clients = [], onSendSMS }) => {
  const [selectedClients, setSelectedClients] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showScheduled, setShowScheduled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Szablony SMS
  const smsTemplates = [
    {
      id: 'reminder',
      name: 'Przypomnienie o wizycie',
      text: 'Przypominamy o wizycie {{date}} o {{time}}. Prosimy o potwierdzenie.',
      icon: Calendar
    },
    {
      id: 'confirmation',
      name: 'Potwierdzenie wizyty',
      text: 'Dziękujemy za potwierdzenie wizyty {{date}} o {{time}}. Do zobaczenia!',
      icon: CheckCircle
    },
    {
      id: 'cancellation',
      name: 'Odwołanie wizyty',
      text: 'Wizyta {{date}} o {{time}} została odwołana. Skontaktuj się z nami w celu przełożenia.',
      icon: AlertCircle
    },
    {
      id: 'promotion',
      name: 'Promocja',
      text: 'Specjalna oferta: {{promotion}}! Ważne do {{endDate}}. Zarezerwuj już dziś!',
      icon: Plus
    }
  ];

  // Symulowane zaplanowane SMS
  const scheduledSMS = [
    {
      id: 1,
      recipient: 'Anna Kowalska',
      phone: '+48 123 456 789',
      message: 'Przypominamy o wizycie jutro o 14:00. Prosimy o potwierdzenie.',
      scheduledFor: '2024-01-15T08:00:00',
      status: 'scheduled'
    },
    {
      id: 2,
      recipient: 'Maria Nowak',
      phone: '+48 987 654 321',
      message: 'Dziękujemy za wizytę! Pamiętaj o zaleceniach po zabiegu.',
      scheduledFor: '2024-01-15T16:00:00',
      status: 'scheduled'
    }
  ];

  const handleTemplateSelect = (template) => {
    setMessageText(template.text);
  };

  const handleSendSMS = async () => {
    if (!messageText.trim()) {
      toast.error('Wprowadź treść wiadomości');
      return;
    }
    if (selectedClients.length === 0) {
      toast.error('Wybierz odbiorców');
      return;
    }
    if (messageText.length > 160) {
      toast.error('Wiadomość jest za długa (maksymalnie 160 znaków)');
      return;
    }

    setIsLoading(true);
    try {
      await onSendSMS({
        message: messageText,
        recipients: selectedClients,
        scheduledFor: scheduledTime || null
      });
      
      // Reset form
      setMessageText('');
      setSelectedClients([]);
      setScheduledTime('');
      
      toast.success('SMS został wysłany!');
    } catch (error) {
      console.error('Błąd wysyłania SMS:', error);
      toast.error('Wystąpił błąd podczas wysyłania SMS');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleSMS = async () => {
    if (!scheduledTime) {
      toast.error('Wybierz czas wysłania');
      return;
    }
    if (!messageText.trim()) {
      toast.error('Wprowadź treść wiadomości');
      return;
    }
    if (selectedClients.length === 0) {
      toast.error('Wybierz odbiorców');
      return;
    }

    setIsLoading(true);
    try {
      await onSendSMS({
        message: messageText,
        recipients: selectedClients,
        scheduledFor: scheduledTime
      });
      
      setMessageText('');
      setSelectedClients([]);
      setScheduledTime('');
      setShowScheduled(false);
      
      toast.success('SMS został zaplanowany!');
    } catch (error) {
      console.error('Błąd planowania SMS:', error);
      toast.error('Wystąpił błąd podczas planowania SMS');
    } finally {
      setIsLoading(false);
    }
  };

  const charactersLeft = 160 - messageText.length;
  const isOverLimit = charactersLeft < 0;

  return (
    <div className="sms-manager">
      <div className="sms-header">
        <h2>Zarządzanie SMS</h2>
        <div className="sms-actions">
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.2)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary"
            onClick={() => setShowScheduled(!showScheduled)}
            title="Pokaż zaplanowane SMS"
          >
            <Clock size={18} />
            Zaplanowane SMS
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary" 
            onClick={handleSendSMS}
            disabled={isLoading}
            title="Wyślij SMS"
          >
            {isLoading ? <Loader size={18} /> : <Send size={18} />}
            {isLoading ? 'Wysyłanie...' : 'Wyślij SMS'}
          </motion.button>
        </div>
      </div>

      <div className="sms-content">
        {/* Szablony SMS */}
        <div className="sms-templates-section">
          <h3>Szablony SMS</h3>
          <div className="sms-templates-grid">
            {smsTemplates.map((template) => (
              <motion.div
                key={template.id}
                className="sms-template-card"
                onClick={() => handleTemplateSelect(template)}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                title={`Wybierz szablon: ${template.name}`}
              >
                <div className="template-icon">
                  <template.icon size={20} title={template.name} />
                </div>
                <div className="template-content">
                  <h4>{template.name}</h4>
                  <p>{template.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Edytor SMS */}
        <div className="sms-editor">
          <div className="editor-section">
            <label>Treść wiadomości</label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Wprowadź treść wiadomości SMS... (maksymalnie 160 znaków)"
              rows={4}
              className={`sms-textarea ${isOverLimit ? 'over-limit' : ''}`}
              maxLength={160}
            />
            <div className={`character-count ${isOverLimit ? 'over-limit' : ''}`}>
              {charactersLeft} znaków pozostało
            </div>
          </div>

          {/* Planowanie */}
          <div className="scheduling-section">
            <label>
              <input
                type="checkbox"
                checked={showScheduled}
                onChange={(e) => setShowScheduled(e.target.checked)}
              />
              Zaplanuj wysłanie
            </label>
            
            <AnimatePresence>
              {showScheduled && (
                <motion.div
                  className="scheduling-options"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="schedule-input"
                  />
                  <button 
                    className="btn-secondary"
                    onClick={handleScheduleSMS}
                    disabled={!scheduledTime || !messageText.trim() || selectedClients.length === 0}
                  >
                    <Clock size={16} />
                    Zaplanuj SMS
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Wybór odbiorców */}
        <div className="recipients-section">
          <h3>Wybierz odbiorców ({selectedClients.length})</h3>
          <div className="recipients-filters">
            <button 
              className={`filter-btn ${selectedClients.length === clients.length ? 'active' : ''}`}
              onClick={() => setSelectedClients(clients.map(c => c.id))}
            >
              Wszyscy klienci
            </button>
            <button 
              className={`filter-btn ${selectedClients.length === 0 ? 'active' : ''}`}
              onClick={() => setSelectedClients([])}
            >
              Wyczyść wybór
            </button>
          </div>
          
          <div className="recipients-list">
            {clients.map((client) => (
              <label key={client.id} className="recipient-item">
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedClients([...selectedClients, client.id]);
                    } else {
                      setSelectedClients(selectedClients.filter(id => id !== client.id));
                    }
                  }}
                />
                <div className="recipient-info">
                  <span className="recipient-name">{client.name}</span>
                  <span className="recipient-phone">{client.phone || 'Brak numeru'}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Zaplanowane SMS */}
        <AnimatePresence>
          {showScheduled && (
            <motion.div
              className="scheduled-sms-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h3>Zaplanowane SMS</h3>
              <div className="scheduled-sms-list">
                {scheduledSMS.map((sms) => (
                  <div key={sms.id} className="scheduled-sms-item">
                    <div className="sms-info">
                      <div className="sms-header-info">
                        <h4>{sms.recipient}</h4>
                        <span className="sms-phone">{sms.phone}</span>
                      </div>
                      <p className="sms-message">{sms.message}</p>
                      <span className="sms-time">
                        Zaplanowane na: {new Date(sms.scheduledFor).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    <div className="sms-actions">
                      <button className="btn-icon" title="Edytuj">
                        <Plus size={16} />
                      </button>
                      <button className="btn-icon delete" title="Usuń">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SMSManager; 