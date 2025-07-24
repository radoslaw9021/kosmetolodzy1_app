// Serwis do zarządzania użytkownikami - pomocnicze funkcje
import { authAPI } from './apiService';

// Pobierz wszystkich użytkowników
export const getUsers = async () => {
  // TODO: Implementacja przez API
  return [];
};

// Resetuj użytkowników do domyślnych (dodaje nowe konta)
export const resetUsersToDefault = () => {
  // TODO: Implementacja przez API
  return [];
};

// Zapisz użytkowników
export const saveUsers = async (users) => {
  // TODO: Implementacja przez API
};

// Dodaj nowego użytkownika
export const addUser = async (userData) => {
  // TODO: Implementacja przez API
  return null;
};

// Aktualizuj użytkownika
export const updateUser = async (userId, userData) => {
  // TODO: Implementacja przez API
  return null;
};

// Usuń użytkownika
export const deleteUser = async (userId) => {
  // TODO: Implementacja przez API
};

// Sprawdź dane logowania
export const authenticateUser = async (email, password) => {
  // TODO: Implementacja przez API
  return null;
};

// Pobierz aktualnego użytkownika
export const getCurrentUser = () => {
  return authAPI.getCurrentUser();
};

// Ustaw aktualnego użytkownika
export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

// Sprawdź czy użytkownik ma rolę admina
export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

// Sprawdź czy użytkownik ma rolę kosmetologa
export const isKosmetolog = (user) => {
  return user && user.role === 'kosmetolog';
};

// Pobierz tylko kosmetologów
export const getKosmetolodzy = () => {
  const users = getUsers();
  return users.filter(user => user.role === 'kosmetolog');
};

// ===== FUNKCJE DO ZARZĄDZANIA WIZYTAMI =====

// Pobierz wszystkie wizyty dla danego użytkownika
export const getAppointmentsForUser = (userId, clients) => {
  // TODO: Implementacja przez API
  return [];
};

// Dodaj wizytę do klienta
export const addAppointmentToClient = (clientId, appointmentData, clients, setClients) => {
  // TODO: Implementacja przez API
  return null;
};

// Aktualizuj wizytę
export const updateAppointment = (clientId, appointmentId, updatedData, clients, setClients) => {
  // TODO: Implementacja przez API
};

// Usuń wizytę
export const deleteAppointment = (clientId, appointmentId, clients, setClients) => {
  // TODO: Implementacja przez API
};

// Pobierz wizyty na konkretny dzień
export const getAppointmentsForDate = (date, userId, clients) => {
  // TODO: Implementacja przez API
  return [];
};

// Pobierz nadchodzące wizyty (dzisiaj i później)
export const getUpcomingAppointments = (userId, clients) => {
  // TODO: Implementacja przez API
  return [];
}; 