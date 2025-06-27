import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Send, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  Smartphone,
  Mail,
  Zap,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';
import { Snackbar, Button, Box, IconButton, CircularProgress, Tabs, Tab, TextField, Tooltip as MuiTooltip } from '@mui/material';

const NotificationCenter = ({ clients = [], onSendNotification }) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'reminder',
    priority: 'normal',
    scheduledFor: '',
    channels: ['app']
  });
  const [userTemplates, setUserTemplates] = useState([]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    id: null,
    name: '',
    description: '',
    title: '',
    message: '',
    channels: ['app']
  });
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Szablony powiadomień
  const notificationTemplates = [
    {
      id: 'reminder',
      name: 'Przypomnienie o wizycie',
      description: 'Automatyczne przypomnienie o nadchodzącej wizycie',
      icon: Calendar,
      color: '#667eea',
      title: 'Przypomnienie o wizycie',
      message: 'Przypominamy o wizycie {{date}} o {{time}}. Prosimy o potwierdzenie.',
      channels: ['app', 'email', 'sms']
    },
    {
      id: 'promotion',
      name: 'Promocja',
      description: 'Powiadomienie o specjalnej ofercie',
      icon: Zap,
      color: '#ff6b6b',
      title: 'Specjalna oferta!',
      message: '{{promotion}} - ważne do {{endDate}}. Zarezerwuj już dziś!',
      channels: ['app', 'email']
    },
    {
      id: 'follow-up',
      name: 'Follow-up po zabiegu',
      description: 'Kontakt po zabiegu z zaleceniami',
      icon: CheckCircle,
      color: '#43e97b',
      title: 'Dziękujemy za wizytę!',
      message: 'Mamy nadzieję, że jesteś zadowolona z zabiegu. Pamiętaj o zaleceniach.',
      channels: ['app', 'email']
    },
    {
      id: 'system',
      name: 'Powiadomienie systemowe',
      description: 'Informacje o zmianach w systemie',
      icon: Settings,
      color: '#9e9e9e',
      title: 'Aktualizacja systemu',
      message: 'System został zaktualizowany. Sprawdź nowe funkcje!',
      channels: ['app']
    }
  ];

  // Symulowane powiadomienia
  const notifications = [
    {
      id: 1,
      title: 'Przypomnienie o wizycie',
      message: 'Przypominamy o wizycie jutro o 14:00. Prosimy o potwierdzenie.',
      type: 'reminder',
      priority: 'high',
      channels: ['app', 'email'],
      sentAt: '2024-01-15T08:00:00',
      recipients: 45,
      read: 32,
      status: 'sent'
    },
    {
      id: 2,
      title: 'Specjalna oferta!',
      message: '20% zniżki na peeling chemiczny - ważne do 31 stycznia.',
      type: 'promotion',
      priority: 'normal',
      channels: ['app', 'email'],
      sentAt: '2024-01-14T10:00:00',
      recipients: 89,
      read: 67,
      status: 'sent'
    },
    {
      id: 3,
      title: 'Dziękujemy za wizytę!',
      message: 'Mamy nadzieję, że jesteś zadowolona z zabiegu.',
      type: 'follow-up',
      priority: 'low',
      channels: ['app'],
      sentAt: '2024-01-13T16:00:00',
      recipients: 23,
      read: 18,
      status: 'sent'
    }
  ];

  // Symulowane zaplanowane powiadomienia
  const scheduledNotifications = [
    {
      id: 1,
      title: 'Przypomnienie o wizycie',
      message: 'Przypominamy o wizycie 20 stycznia o 10:00.',
      type: 'reminder',
      scheduledFor: '2024-01-19T08:00:00',
      recipients: 12,
      status: 'scheduled'
    }
  ];

  const notificationTypes = [
    { id: 'reminder', name: 'Przypomnienie', icon: Calendar, color: '#667eea' },
    { id: 'promotion', name: 'Promocja', icon: Zap, color: '#ff6b6b' },
    { id: 'follow-up', name: 'Follow-up', icon: CheckCircle, color: '#43e97b' },
    { id: 'system', name: 'Systemowe', icon: Settings, color: '#9e9e9e' }
  ];

  const priorityLevels = [
    { id: 'low', name: 'Niska', color: '#43e97b' },
    { id: 'normal', name: 'Normalna', color: '#667eea' },
    { id: 'high', name: 'Wysoka', color: '#ff6b6b' }
  ];

  const channels = [
    { id: 'app', name: 'Aplikacja', icon: Bell },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'sms', name: 'SMS', icon: Smartphone }
  ];

  const handleTemplateSelect = (template) => {
    setNotificationData({
      title: template.title,
      message: template.message,
      type: template.id,
      priority: 'normal',
      scheduledFor: '',
      channels: template.channels
    });
  };

  const handleSendNotification = async () => {
    if (!notificationData.title.trim()) {
      toast.error('Wprowadź tytuł powiadomienia');
      return;
    }
    if (!notificationData.message.trim()) {
      toast.error('Wprowadź treść powiadomienia');
      return;
    }
    if (selectedClients.length === 0) {
      toast.error('Wybierz odbiorców');
      return;
    }

    setIsLoading(true);
    try {
      await onSendNotification({
        ...notificationData,
        recipients: selectedClients,
        scheduledFor: notificationData.scheduledFor || null
      });
      
      // Reset form
      setNotificationData({
        title: '',
        message: '',
        type: 'reminder',
        priority: 'normal',
        scheduledFor: '',
        channels: ['app']
      });
      setSelectedClients([]);
      setShowCreateForm(false);
      
      toast.success('Powiadomienie zostało wysłane!');
    } catch (error) {
      console.error('Błąd wysyłania powiadomienia:', error);
      toast.error('Wystąpił błąd podczas wysyłania powiadomienia');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleNotification = async () => {
    if (!notificationData.scheduledFor) {
      toast.error('Wybierz czas wysłania');
      return;
    }
    if (!notificationData.title.trim()) {
      toast.error('Wprowadź tytuł powiadomienia');
      return;
    }
    if (!notificationData.message.trim()) {
      toast.error('Wprowadź treść powiadomienia');
      return;
    }
    if (selectedClients.length === 0) {
      toast.error('Wybierz odbiorców');
      return;
    }

    setIsLoading(true);
    try {
      await onSendNotification({
        ...notificationData,
        recipients: selectedClients,
        scheduledFor: notificationData.scheduledFor
      });
      
      setNotificationData({
        title: '',
        message: '',
        type: 'reminder',
        priority: 'normal',
        scheduledFor: '',
        channels: ['app']
      });
      setSelectedClients([]);
      setShowCreateForm(false);
      
      toast.success('Powiadomienie zostało zaplanowane!');
    } catch (error) {
      console.error('Błąd planowania powiadomienia:', error);
      toast.error('Wystąpił błąd podczas planowania powiadomienia');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    return priorityLevels.find(p => p.id === priority)?.color || '#9e9e9e';
  };

  const getTypeIcon = (type) => {
    return notificationTypes.find(t => t.id === type)?.icon || Settings;
  };

  const getTypeColor = (type) => {
    return notificationTypes.find(t => t.id === type)?.color || '#9e9e9e';
  };

  // --- CRUD HANDLERS ---
  const handleTemplateSave = () => {
    if (!templateForm.name.trim() || !templateForm.title.trim() || !templateForm.message.trim()) {
      setSnackbar({ open: true, message: 'Uzupełnij wszystkie wymagane pola', severity: 'error' });
      return;
    }
    setIsTemplateLoading(true);
    setTimeout(() => {
      if (templateForm.id) {
        setUserTemplates(templates => templates.map(t => t.id === templateForm.id ? { ...templateForm } : t));
        setSnackbar({ open: true, message: 'Szablon zaktualizowany!', severity: 'success' });
      } else {
        setUserTemplates(templates => [...templates, { ...templateForm, id: Date.now() }]);
        setSnackbar({ open: true, message: 'Szablon dodany!', severity: 'success' });
      }
      setShowTemplateForm(false);
      setTemplateForm({ id: null, name: '', description: '', title: '', message: '', channels: ['app'] });
      setIsTemplateLoading(false);
    }, 700);
  };
  const handleTemplateEdit = (tpl) => {
    setTemplateForm({ ...tpl });
    setShowTemplateForm(true);
  };
  const handleTemplateDelete = (id) => {
    setUserTemplates(templates => templates.filter(t => t.id !== id));
    setSnackbar({ open: true, message: 'Szablon usunięty', severity: 'info' });
  };

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2>Centrum powiadomień</h2>
        <div className="notification-actions">
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.2)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary"
            onClick={() => setShowCreateForm(!showCreateForm)}
            title={showCreateForm ? 'Anuluj tworzenie' : 'Utwórz nowe powiadomienie'}
          >
            <Plus size={18} />
            {showCreateForm ? 'Anuluj' : 'Nowe powiadomienie'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            title="Ustawienia powiadomień"
          >
            <Settings size={18} />
            Ustawienia
          </motion.button>
        </div>
      </div>

      {/* Formularz tworzenia powiadomienia */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            className="create-notification-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3>Nowe powiadomienie</h3>
            <div className="form-grid">
              <div className="form-section">
                <label>Tytuł powiadomienia *</label>
                <input
                  type="text"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                  placeholder="Wprowadź tytuł powiadomienia (np. 'Przypomnienie o wizycie')"
                  className="form-input"
                />
              </div>

              <div className="form-section">
                <label>Wiadomość *</label>
                <textarea
                  value={notificationData.message}
                  onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                  placeholder="Wprowadź treść powiadomienia... Możesz użyć zmiennych jak {{clientName}}"
                  rows={4}
                  className="form-textarea"
                />
              </div>

              <div className="form-section">
                <label>Typ powiadomienia</label>
                <div className="notification-types-grid">
                  {notificationTypes.map((type) => (
                    <label key={type.id} className="notification-type-option">
                      <input
                        type="radio"
                        name="notificationType"
                        value={type.id}
                        checked={notificationData.type === type.id}
                        onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value })}
                      />
                      <div className="type-content">
                        <type.icon size={20} style={{ color: type.color }} title={type.name} />
                        <span>{type.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label>Priorytet</label>
                <select
                  value={notificationData.priority}
                  onChange={(e) => setNotificationData({ ...notificationData, priority: e.target.value })}
                  className="form-select"
                >
                  {priorityLevels.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label>Kanały wysyłania</label>
                <div className="channels-grid">
                  {channels.map((channel) => (
                    <label key={channel.id} className="channel-option">
                      <input
                        type="checkbox"
                        checked={notificationData.channels.includes(channel.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNotificationData({
                              ...notificationData,
                              channels: [...notificationData.channels, channel.id]
                            });
                          } else {
                            setNotificationData({
                              ...notificationData,
                              channels: notificationData.channels.filter(c => c !== channel.id)
                            });
                          }
                        }}
                      />
                      <div className="channel-content">
                        <channel.icon size={16} />
                        <span>{channel.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label>Zaplanuj wysłanie (opcjonalnie)</label>
                <input
                  type="datetime-local"
                  value={notificationData.scheduledFor}
                  onChange={(e) => setNotificationData({ ...notificationData, scheduledFor: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.2)' }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary"
                onClick={() => setShowCreateForm(false)}
                title="Anuluj tworzenie powiadomienia"
              >
                Anuluj
              </motion.button>
              {notificationData.scheduledFor ? (
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary"
                  onClick={handleScheduleNotification}
                  disabled={isLoading}
                  title="Zaplanuj powiadomienie"
                >
                  {isLoading ? <Loader size={16} /> : <Clock size={16} />}
                  {isLoading ? 'Planowanie...' : 'Zaplanuj'}
                </motion.button>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                  onClick={handleSendNotification}
                  disabled={isLoading}
                  title="Wyślij powiadomienie teraz"
                >
                  {isLoading ? <Loader size={16} /> : <Send size={16} />}
                  {isLoading ? 'Wysyłanie...' : 'Wyślij teraz'}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="notification-tabs">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.2)' }}
          whileTap={{ scale: 0.97 }}
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
          title="Pokaż szablony powiadomień"
        >
          <Plus size={16} />
          Szablony
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.2)' }}
          whileTap={{ scale: 0.97 }}
          className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
          title="Pokaż wysłane powiadomienia"
        >
          <Send size={16} />
          Wysłane
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.2)' }}
          whileTap={{ scale: 0.97 }}
          className={`tab-btn ${activeTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduled')}
          title="Pokaż zaplanowane powiadomienia"
        >
          <Clock size={16} />
          Zaplanowane
        </motion.button>
      </div>

      {/* Content */}
      <div className="notification-content">
        {activeTab === 'templates' && (
          <div className="templates-section">
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} textColor="primary" indicatorColor="primary">
                  <Tab label="Szablony" value="templates" />
                  <Tab label="Wysłane" value="sent" />
                  <Tab label="Zaplanowane" value="scheduled" />
                </Tabs>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={20} />}
                    onClick={() => { setShowTemplateForm(v => !v); setTemplateForm({ id: null, name: '', description: '', title: '', message: '', channels: ['app'] }); }}
                    sx={{ borderRadius: 2, fontWeight: 700, fontSize: 16, ml: 2 }}
                  >
                    {showTemplateForm ? 'Anuluj' : 'Nowy szablon'}
                  </Button>
                </motion.div>
              </Box>
              <AnimatePresence>
                {showTemplateForm && (
                  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4 }}>
                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f9f9fb', boxShadow: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                        <TextField label="Nazwa szablonu" value={templateForm.name} onChange={e => setTemplateForm(f => ({ ...f, name: e.target.value }))} size="small" sx={{ flex: 1, minWidth: 180 }} />
                        <TextField label="Opis" value={templateForm.description} onChange={e => setTemplateForm(f => ({ ...f, description: e.target.value }))} size="small" sx={{ flex: 2, minWidth: 220 }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                        <TextField label="Tytuł powiadomienia" value={templateForm.title} onChange={e => setTemplateForm(f => ({ ...f, title: e.target.value }))} size="small" sx={{ flex: 1, minWidth: 180 }} />
                        <TextField label="Treść powiadomienia" value={templateForm.message} onChange={e => setTemplateForm(f => ({ ...f, message: e.target.value }))} size="small" sx={{ flex: 2, minWidth: 220 }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleTemplateSave}
                          disabled={isTemplateLoading}
                          startIcon={isTemplateLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle size={18} />}
                          sx={{ borderRadius: 2, fontWeight: 700, fontSize: 16, minWidth: 160 }}
                        >
                          {isTemplateLoading ? 'Zapisywanie...' : (templateForm.id ? 'Zapisz zmiany' : 'Dodaj szablon')}
                        </Button>
                      </Box>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                {[...notificationTemplates, ...userTemplates].map(tpl => (
                  <motion.div key={tpl.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #a855f733', padding: 18, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tpl.color || '#a78bfa', mr: 1 }} />
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{tpl.name}</span>
                      <span style={{ marginLeft: 8, color: '#aaa', fontSize: 13 }}>{tpl.description}</span>
                    </Box>
                    <span style={{ color: '#666', fontSize: 15 }}>{tpl.title}</span>
                    <span style={{ color: '#888', fontSize: 14 }}>{tpl.message}</span>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <MuiTooltip title="Użyj szablonu" arrow>
                        <IconButton color="primary" size="small" onClick={() => handleTemplateSelect(tpl)}><Send size={18} /></IconButton>
                      </MuiTooltip>
                      {userTemplates.some(u => u.id === tpl.id) && (
                        <MuiTooltip title="Edytuj" arrow>
                          <IconButton color="info" size="small" onClick={() => handleTemplateEdit(tpl)}><Edit size={18} /></IconButton>
                        </MuiTooltip>
                      )}
                      {userTemplates.some(u => u.id === tpl.id) && (
                        <MuiTooltip title="Usuń" arrow>
                          <IconButton color="error" size="small" onClick={() => handleTemplateDelete(tpl.id)}><Trash2 size={18} /></IconButton>
                        </MuiTooltip>
                      )}
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>
            <Snackbar
              open={snackbar.open}
              autoHideDuration={3500}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              message={snackbar.message}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
          </div>
        )}

        {activeTab === 'sent' && (
          <div className="sent-notifications-section">
            <h3>Wysłane powiadomienia</h3>
            <div className="notifications-list">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className="notification-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="notification-header-info">
                    <div className="notification-title">
                      <h4>{notification.title}</h4>
                      <span 
                        className="notification-priority"
                        style={{ color: getPriorityColor(notification.priority) }}
                      >
                        {priorityLevels.find(p => p.id === notification.priority)?.name}
                      </span>
                    </div>
                    <div className="notification-type">
                      {(() => {
                        const Icon = getTypeIcon(notification.type);
                        return <Icon size={16} style={{ color: getTypeColor(notification.type) }} />;
                      })()}
                    </div>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  <div className="notification-meta">
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{new Date(notification.sentAt).toLocaleString('pl-PL')}</span>
                    </div>
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{notification.recipients} odbiorców</span>
                    </div>
                    <div className="meta-item">
                      <CheckCircle size={16} />
                      <span>{notification.read} przeczytane</span>
                    </div>
                  </div>
                  
                  <div className="notification-channels">
                    {notification.channels.map(channel => (
                      <span key={channel} className="channel-badge">
                        {(() => {
                          const channelInfo = channels.find(c => c.id === channel);
                          return channelInfo?.icon ? <channelInfo.icon size={12} /> : null;
                        })()}
                        {channels.find(c => c.id === channel)?.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="scheduled-notifications-section">
            <h3>Zaplanowane powiadomienia</h3>
            <div className="scheduled-notifications-list">
              {scheduledNotifications.map((notification) => (
                <div key={notification.id} className="scheduled-notification-item">
                  <div className="notification-info">
                    <div className="notification-header-info">
                      <h4>{notification.title}</h4>
                      <span className="scheduled-time">
                        Zaplanowane na: {new Date(notification.scheduledFor).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-meta">
                      <div className="meta-item">
                        <Users size={16} />
                        <span>{notification.recipients} odbiorców</span>
                      </div>
                    </div>
                  </div>
                  <div className="notification-actions">
                    <button className="btn-icon" title="Edytuj">
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon delete" title="Usuń">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter; 