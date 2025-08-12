const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

class TreatmentConsentService {
  // Pobierz token z localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Utwórz lub zaktualizuj zgodę na zabieg
  async createOrUpdateConsent(consentData) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Brak tokenu autoryzacji');
      }

      const response = await fetch(`${API_BASE_URL}/treatment-consents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(consentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas zapisywania zgody');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating/updating consent:', error);
      throw error;
    }
  }

  // Pobierz aktualną zgodę klienta
  async getClientConsent(clientId) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Brak tokenu autoryzacji');
      }

      const response = await fetch(`${API_BASE_URL}/treatment-consents/client/${clientId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 404) {
        return null; // Klient nie ma jeszcze zgody
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas pobierania zgody');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching client consent:', error);
      throw error;
    }
  }

  // Pobierz wszystkie zgody klienta
  async getClientConsents(clientId) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Brak tokenu autoryzacji');
      }

      const response = await fetch(`${API_BASE_URL}/treatment-consents/client/${clientId}/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas pobierania zgód');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching client consents:', error);
      throw error;
    }
  }

  // Pobierz statystyki zgód klienta
  async getClientConsentStats(clientId) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Brak tokenu autoryzacji');
      }

      const response = await fetch(`${API_BASE_URL}/treatment-consents/client/${clientId}/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas pobierania statystyk');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching consent stats:', error);
      throw error;
    }
  }

  // Unieważnij zgodę
  async invalidateConsent(consentId) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Brak tokenu autoryzacji');
      }

      const response = await fetch(`${API_BASE_URL}/treatment-consents/${consentId}/invalidate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas unieważniania zgody');
      }

      return await response.json();
    } catch (error) {
      console.error('Error invalidating consent:', error);
      throw error;
    }
  }

  // Sprawdź czy klient ma ważną zgodę
  async hasValidConsent(clientId) {
    try {
      const consent = await this.getClientConsent(clientId);
      return consent && consent.data && consent.data.valid;
    } catch (error) {
      console.error('Error checking consent validity:', error);
      return false;
    }
  }
}

export default new TreatmentConsentService();
