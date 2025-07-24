// Serwis API do komunikacji z backendem
const API_BASE_URL = 'http://localhost:4000/api';

// Helper do wykonywania requestów HTTP z autoryzacją
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Pobierz token z localStorage
  const token = localStorage.getItem('authToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token wygasł - wyloguj użytkownika
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
        throw new Error('Unauthorized - please login again');
      }
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

  // Waliduj podpis
  validate: async (id) => {
    return apiRequest(`/signatures/${id}/validate`);
  },

  // Unieważnij podpis
  invalidate: async (id) => {
    return apiRequest(`/signatures/${id}/invalidate`, {
      method: 'POST',
    });
  },

  // Pobierz statystyki podpisów klienta
  getStats: async (clientId) => {
    return apiRequest(`/signatures/client/${clientId}/stats`);
  },
};

// API dla zgód
export const consentAPI = {
  // Pobierz zgody klienta
  getByClientId: async (clientId) => {
    return apiRequest(`/consents/${clientId}`);
  },

  // Aktualizuj zgody klienta
  update: async (clientId, consentsData) => {
    return apiRequest(`/consents/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(consentsData),
    });
  },

  // Pobierz podpisy dla konkretnej zgody
  getSignatures: async (clientId, consentType) => {
    return apiRequest(`/consents/${clientId}/${consentType}/signatures`);
  },

  // Wycofaj zgodę
  withdraw: async (clientId, consentType, reason = '') => {
    return apiRequest(`/consents/${clientId}/${consentType}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Pobierz statystyki zgód klienta
  getStats: async (clientId) => {
    return apiRequest(`/consents/${clientId}/stats`);
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

// API dla zabiegów
export const treatmentAPI = {
  // Dodaj nowy zabieg
  add: async (treatmentData) => {
    return apiRequest('/treatments', {
      method: 'POST',
      body: JSON.stringify(treatmentData),
    });
  },

  // Pobierz zabiegi dla klienta
  getByClient: async (clientId) => {
    return apiRequest(`/treatments/client/${clientId}`);
  },

  // Aktualizuj zabieg
  update: async (id, treatmentData) => {
    return apiRequest(`/treatments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(treatmentData),
    });
  },

  // Usuń zabieg
  delete: async (id) => {
    return apiRequest(`/treatments/${id}`, {
      method: 'DELETE',
    });
  },
};

// API dla autoryzacji
export const authAPI = {
  // Logowanie
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Rejestracja (tylko admin)
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Pobierz profil użytkownika
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  // Wylogowanie
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  // Sprawdź czy użytkownik jest zalogowany
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Pobierz aktualnego użytkownika
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
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
  consentAPI,
  exportAPI,
  treatmentAPI,
  authAPI,
  activityAPI,
  healthCheck,
}; 