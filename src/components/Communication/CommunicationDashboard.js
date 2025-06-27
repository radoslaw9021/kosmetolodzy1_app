import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Users, 
  TrendingUp, 
  Calendar,
  BarChart3
} from 'lucide-react';
import CampaignManager from './CampaignManager';
import NotificationCenter from './NotificationCenter';
import './Communication.css';
import { toast } from 'sonner';

const CommunicationDashboard = ({ 
  clients = [], 
  events = [],
  onSendNotification,
  onCreateCampaign
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    upcomingAppointments: 0,
    campaigns: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const upcomingEvents = events.filter(event => 
      new Date(event.start) > new Date()
    );
    setStats({
      totalClients: clients.length,
      activeClients: clients.filter(c => c.appointments?.length > 0).length,
      upcomingAppointments: upcomingEvents.length,
      campaigns: 12
    });
  }, [clients, events]);

  const tabs = [
    { id: 'overview', label: 'Przegląd', icon: BarChart3 },
    { id: 'campaigns', label: 'Kampanie', icon: TrendingUp },
    { id: 'notifications', label: 'Powiadomienia', icon: Bell }
  ];

  const quickActions = [
    {
      id: 'send-reminder',
      title: 'Wyślij przypomnienie',
      description: 'Przypomnij o wizycie',
      icon: Calendar,
      color: '#667eea',
      action: () => setActiveTab('notifications')
    },
    {
      id: 'promotion',
      title: 'Kampania',
      description: 'Utwórz kampanię',
      icon: TrendingUp,
      color: '#f093fb',
      action: () => setActiveTab('campaigns')
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'campaigns':
        return <CampaignManager clients={clients} onCreateCampaign={onCreateCampaign} />;
      case 'notifications':
        return <NotificationCenter clients={clients} onSendNotification={onSendNotification} />;
      default:
        return (
          <div className="communication-overview">
            {/* Statystyki */}
            <div className="stats-grid">
              <motion.div 
                whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                className="stat-card"
              >
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                  <Users size={24} title="Wszyscy klienci" />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalClients}</h3>
                  <p>Wszyscy klienci</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                className="stat-card"
              >
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                  <Calendar size={24} title="Nadchodzące wizyty" />
                </div>
                <div className="stat-content">
                  <h3>{stats.upcomingAppointments}</h3>
                  <p>Nadchodzące wizyty</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                className="stat-card"
              >
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
                  <TrendingUp size={24} title="Kampanie" />
                </div>
                <div className="stat-content">
                  <h3>{stats.campaigns}</h3>
                  <p>Kampanie</p>
                </div>
              </motion.div>
            </div>
            {/* Quick actions */}
            <div className="quick-actions-section">
              <div className="quick-actions-grid">
                {quickActions.map(action => (
                  <motion.div
                    key={action.id}
                    whileHover={{ scale: 1.04, boxShadow: '0 6px 24px 0 rgba(102, 126, 234, 0.18)' }}
                    whileTap={{ scale: 0.98 }}
                    className="quick-action-card"
                    style={{ background: 'var(--glass-bg, rgba(40,40,60,0.35))' }}
                    onClick={action.action}
                  >
                    <div className="action-icon" style={{ background: action.color }}>
                      <action.icon size={20} />
                    </div>
                    <div className="action-content">
                      <h4>{action.title}</h4>
                      <p>{action.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="communication-dashboard">
      <div className="communication-header">
        <div className="communication-title">
          <h1>Komunikacja</h1>
          <p>Wysyłaj powiadomienia, zarządzaj kampaniami i kontaktuj się z klientkami w jednym miejscu.</p>
        </div>
        <div className="communication-actions">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.08, background: '#f3e8ff' }}
              whileTap={{ scale: 0.97 }}
              className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="communication-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CommunicationDashboard; 