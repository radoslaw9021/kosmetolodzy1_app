// Serwis API do komunikacji z backendem
const API_BASE_URL = 'http://localhost:4000/api';

// Helper do wykonywania requestów HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API dla klientów
export const clientAPI = {
  // Pobierz wszystkich klientów
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/clients${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Pobierz klienta po ID
  getById: async (id) => {
    return apiRequest(`/clients/${id}`);
  },

  // Utwórz nowego klienta
  create: async (clientData) => {
    return apiRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  },

  // Aktualizuj klienta
  update: async (id, clientData) => {
    return apiRequest(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  },

  // Zarchiwizuj klienta
  archive: async (id) => {
    return apiRequest(`/clients/${id}/archive`, {
      method: 'POST',
    });
  },

  // Odarchiwizuj klienta
  unarchive: async (id) => {
    return apiRequest(`/clients/${id}/unarchive`, {
      method: 'POST',
    });
  },

  // Pobierz logi aktywności klienta
  getActivityLogs: async (id) => {
    return apiRequest(`/clients/${id}/activity`);
  },
};

// API dla podpisów
export const signatureAPI = {
  // Pobierz podpisy klienta
  getByClientId: async (clientId) => {
    return apiRequest(`/signatures/client/${clientId}`);
  },

  // Utwórz nowy podpis
  create: async (signatureData) => {
    return apiRequest('/signatures', {
      method: 'POST',
      body: JSON.stringify(signatureData),
    });
  },

  // Pobierz podpis po ID
  getById: async (id) => {
    return apiRequest(`/signatures/${id}`);
  },

  // Usuń podpis
  delete: async (id) => {
    return apiRequest(`/signatures/${id}`, {
      method: 'DELETE',
    });
  },
};

// API dla eksportu
export const exportAPI = {
  // Eksport pojedynczego klienta
  exportClient: async (clientId, format = 'pdf') => {
    return apiRequest('/export/client', {
      method: 'POST',
      body: JSON.stringify({ clientId, format }),
    });
  },

  // Eksport zbiorczy
  bulkExport: async (clientIds, format = 'zip') => {
    return apiRequest('/export/bulk', {
      method: 'POST',
      body: JSON.stringify({ clientIds, format }),
    });
  },
};

// API dla logów aktywności
export const activityAPI = {
  // Pobierz wszystkie logi
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/activity-logs${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // Pobierz logi dla konkretnego użytkownika
  getByUser: async (userId) => {
    return apiRequest(`/activity-logs/user/${userId}`);
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health');
};

export default {
  clientAPI,
  signatureAPI,
  exportAPI,
  activityAPI,
  healthCheck,
}; 