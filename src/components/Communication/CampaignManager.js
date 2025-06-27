import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Calendar, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2,
  Play,
  Pause,
  Eye,
  Mail,
  MessageSquare,
  Share2,
  DollarSign,
  CheckCircle,
  Loader
} from 'lucide-react';
import { Snackbar, Button, Tabs, Tab, Box, CircularProgress, IconButton, Tooltip as MuiTooltip } from '@mui/material';
import { toast } from 'sonner';

const tabOptions = [
  { label: 'Aktywne', value: 'active' },
  { label: 'Wstrzymane', value: 'paused' },
  { label: 'Szkice', value: 'draft' },
  { label: 'Zakończone', value: 'completed' },
];

const CampaignManager = ({ clients = [], onCreateCampaign }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    type: 'email',
    targetAudience: 'all',
    startDate: '',
    endDate: '',
    budget: '',
    content: ''
  });

  // Symulowane kampanie
  const campaigns = [
    {
      id: 1,
      name: 'Kampania "Lato 2024"',
      description: 'Promocja na zabiegi letnie',
      type: 'email',
      status: 'active',
      targetAudience: 'all',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      budget: 500,
      spent: 320,
      sent: 156,
      opened: 89,
      clicked: 23,
      conversions: 12,
      ctr: 14.7,
      roi: 240
    },
    {
      id: 2,
      name: 'Przypomnienia o wizytach',
      description: 'Automatyczne przypomnienia SMS',
      type: 'sms',
      status: 'active',
      targetAudience: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 200,
      spent: 45,
      sent: 89,
      delivered: 87,
      clicked: 0,
      conversions: 34,
      ctr: 0,
      roi: 680
    },
    {
      id: 3,
      name: 'Newsletter miesięczny',
      description: 'Regularny newsletter z promocjami',
      type: 'email',
      status: 'paused',
      targetAudience: 'newsletter',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 300,
      spent: 120,
      sent: 45,
      opened: 28,
      clicked: 8,
      conversions: 5,
      ctr: 17.8,
      roi: 150
    }
  ];

  const campaignTypes = [
    { id: 'email', name: 'Email Marketing', icon: Mail, color: '#667eea' },
    { id: 'sms', name: 'SMS Marketing', icon: MessageSquare, color: '#43e97b' },
    { id: 'social', name: 'Social Media', icon: Share2, color: '#ff6b6b' },
    { id: 'retargeting', name: 'Retargeting', icon: Target, color: '#764ba2' }
  ];

  const targetAudiences = [
    { id: 'all', name: 'Wszyscy klienci', count: clients.length },
    { id: 'active', name: 'Aktywni klienci', count: clients.filter(c => c.appointments?.length > 0).length },
    { id: 'inactive', name: 'Nieaktywni klienci', count: clients.filter(c => !c.appointments?.length).length },
    { id: 'newsletter', name: 'Subskrybenci newslettera', count: Math.floor(clients.length * 0.7) }
  ];

  const handleCreateCampaign = async () => {
    if (!campaignData.name.trim()) {
      setSnackbar({ open: true, message: 'Wprowadź nazwę kampanii', severity: 'error' });
      return;
    }
    if (!campaignData.startDate) {
      setSnackbar({ open: true, message: 'Wybierz datę rozpoczęcia', severity: 'error' });
      return;
    }
    if (!campaignData.endDate) {
      setSnackbar({ open: true, message: 'Wybierz datę zakończenia', severity: 'error' });
      return;
    }
    setIsLoading(true);
    try {
      await onCreateCampaign({
        ...campaignData,
        id: Date.now(),
        status: 'draft',
        sent: 0,
        opened: 0,
        clicked: 0,
        conversions: 0,
        spent: 0
      });
      setCampaignData({
        name: '',
        description: '',
        type: 'email',
        targetAudience: 'all',
        startDate: '',
        endDate: '',
        budget: '',
        content: ''
      });
      setShowCreateForm(false);
      setSnackbar({ open: true, message: 'Kampania została utworzona!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Błąd podczas tworzenia kampanii', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#43e97b';
      case 'paused': return '#ffa726';
      case 'draft': return '#9e9e9e';
      case 'completed': return '#667eea';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktywna';
      case 'paused': return 'Wstrzymana';
      case 'draft': return 'Szkic';
      case 'completed': return 'Zakończona';
      default: return 'Nieznany';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'active') return campaign.status === 'active';
    if (activeTab === 'paused') return campaign.status === 'paused';
    if (activeTab === 'draft') return campaign.status === 'draft';
    if (activeTab === 'completed') return campaign.status === 'completed';
    return true;
  });

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: 44 }}
          >
            {tabOptions.map(tab => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                sx={{ fontWeight: 600, fontSize: 16, minHeight: 44, textTransform: 'none' }}
                component={motion.div}
                whileHover={{ scale: 1.08, background: '#f3e8ff' }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            ))}
          </Tabs>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus size={20} />}
              onClick={() => setShowCreateForm(v => !v)}
              sx={{ borderRadius: 2, fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px #a855f733', ml: 2 }}
            >
              {showCreateForm ? 'Anuluj' : 'Nowa kampania'}
            </Button>
          </motion.div>
        </Box>
      </motion.div>
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: 24 }}
          >
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f9f9fb', boxShadow: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <input
                  type="text"
                  placeholder="Nazwa kampanii"
                  value={campaignData.name}
                  onChange={e => setCampaignData({ ...campaignData, name: e.target.value })}
                  style={{ flex: 1, minWidth: 180, padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                />
                <input
                  type="text"
                  placeholder="Opis"
                  value={campaignData.description}
                  onChange={e => setCampaignData({ ...campaignData, description: e.target.value })}
                  style={{ flex: 2, minWidth: 220, padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <select
                  value={campaignData.type}
                  onChange={e => setCampaignData({ ...campaignData, type: e.target.value })}
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                >
                  {campaignTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                <select
                  value={campaignData.targetAudience}
                  onChange={e => setCampaignData({ ...campaignData, targetAudience: e.target.value })}
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                >
                  {targetAudiences.map(aud => (
                    <option key={aud.id} value={aud.id}>{aud.name} ({aud.count})</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={campaignData.startDate}
                  onChange={e => setCampaignData({ ...campaignData, startDate: e.target.value })}
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                />
                <input
                  type="date"
                  value={campaignData.endDate}
                  onChange={e => setCampaignData({ ...campaignData, endDate: e.target.value })}
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                />
                <input
                  type="number"
                  placeholder="Budżet (zł)"
                  value={campaignData.budget}
                  onChange={e => setCampaignData({ ...campaignData, budget: e.target.value })}
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, maxWidth: 120 }}
                />
              </Box>
              <textarea
                placeholder="Treść kampanii..."
                value={campaignData.content}
                onChange={e => setCampaignData({ ...campaignData, content: e.target.value })}
                style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCreateCampaign}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle size={18} />}
                  sx={{ borderRadius: 2, fontWeight: 700, fontSize: 16, minWidth: 160 }}
                >
                  {isLoading ? 'Tworzenie...' : 'Utwórz kampanię'}
                </Button>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 180 }}>
            <CircularProgress size={48} color="primary" />
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              {filteredCampaigns.map(campaign => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #a855f733', padding: 22, display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(campaign.status), mr: 1 }} />
                    <span style={{ fontWeight: 700, fontSize: 18 }}>{campaign.name}</span>
                    <span style={{ marginLeft: 8, color: '#aaa', fontSize: 13 }}>{getStatusText(campaign.status)}</span>
                  </Box>
                  <span style={{ color: '#666', fontSize: 15 }}>{campaign.description}</span>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <MuiTooltip title="Edytuj" arrow>
                      <IconButton color="primary" size="small"><Edit size={18} /></IconButton>
                    </MuiTooltip>
                    {campaign.status === 'active' ? (
                      <MuiTooltip title="Wstrzymaj" arrow>
                        <IconButton color="warning" size="small"><Pause size={18} /></IconButton>
                      </MuiTooltip>
                    ) : (
                      <MuiTooltip title="Aktywuj" arrow>
                        <IconButton color="success" size="small"><Play size={18} /></IconButton>
                      </MuiTooltip>
                    )}
                    <MuiTooltip title="Usuń" arrow>
                      <IconButton color="error" size="small"><Trash2 size={18} /></IconButton>
                    </MuiTooltip>
                    <MuiTooltip title="Podgląd" arrow>
                      <IconButton color="info" size="small"><Eye size={18} /></IconButton>
                    </MuiTooltip>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', fontSize: 13, color: '#888' }}>
                    <span><Mail size={15} style={{ verticalAlign: 'middle', marginRight: 2 }} /> {campaign.sent} wysłanych</span>
                    <span><BarChart3 size={15} style={{ verticalAlign: 'middle', marginRight: 2 }} /> {campaign.opened || 0} otwarć</span>
                    <span><TrendingUp size={15} style={{ verticalAlign: 'middle', marginRight: 2 }} /> {campaign.clicked || 0} kliknięć</span>
                    <span><DollarSign size={15} style={{ verticalAlign: 'middle', marginRight: 2 }} /> {campaign.roi || 0}% ROI</span>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        )}
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default CampaignManager; 