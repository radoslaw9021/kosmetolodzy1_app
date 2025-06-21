// Serwis do zarządzania użytkownikami
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

// Domyślni użytkownicy
const defaultUsers = [
  {
    id: 'admin-1',
    email: 'admin@salon.pl',
    password: 'Haslo123!',
    name: 'Administrator',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'kosmetolog-1',
    email: 'anna@salon.pl',
    password: 'Haslo123!',
    name: 'Anna Kowalska',
    role: 'kosmetolog',
    createdAt: new Date().toISOString()
  },
  {
    id: 'kosmetolog-2',
    email: 'joanna@salon.pl',
    password: 'Haslo123!',
    name: 'Joanna Wójcik',
    role: 'kosmetolog',
    createdAt: new Date().toISOString()
  },
  {
    id: 'klient-1',
    email: 'jan.kowalski@example.com',
    password: 'Password1!',
    name: 'Jan Kowalski',
    firstName: 'Jan',
    lastName: 'Kowalski',
    phone: '123456789',
    role: 'Klient',
    createdAt: new Date().toISOString()
  },
  {
    id: 'klient-2',
    email: 'anna.nowak@example.com',
    password: 'Password1!',
    name: 'Anna Nowak',
    firstName: 'Anna',
    lastName: 'Nowak',
    phone: '987654321',
    role: 'Klient',
    createdAt: new Date().toISOString()
  }
];

// Pobierz wszystkich użytkowników
export const getUsers = () => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    // Inicjalizuj z domyślnymi użytkownikami
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
};

// Resetuj użytkowników do domyślnych (dodaje nowe konta)
export const resetUsersToDefault = () => {
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

// Zapisz użytkowników
export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Dodaj nowego użytkownika
export const addUser = (userData) => {
  const users = getUsers();
  const newUser = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  return newUser;
};

// Aktualizuj użytkownika
export const updateUser = (userId, userData) => {
  const users = getUsers();
  const updatedUsers = users.map(user => 
    user.id === userId ? { ...user, ...userData } : user
  );
  saveUsers(updatedUsers);
  return updatedUsers.find(user => user.id === userId);
};

// Usuń użytkownika
export const deleteUser = (userId) => {
  const users = getUsers();
  const updatedUsers = users.filter(user => user.id !== userId);
  saveUsers(updatedUsers);
};

// Sprawdź dane logowania
export const authenticateUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

// Pobierz aktualnego użytkownika
export const getCurrentUser = () => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

// Ustaw aktualnego użytkownika
export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
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
  if (!userId || !clients) return [];
  
  const userAppointments = [];
  
  clients.forEach(client => {
    if (client.appointments && Array.isArray(client.appointments)) {
      client.appointments.forEach(appointment => {
        userAppointments.push({
          ...appointment,
          clientId: client.id,
          clientName: client.name,
          clientPhone: client.phone,
          ownerId: client.ownerId
        });
      });
    }
  });
  
  return userAppointments;
};

// Dodaj wizytę do klienta
export const addAppointmentToClient = (clientId, appointmentData, clients, setClients) => {
  const newAppointment = {
    id: `apt-${Date.now()}`,
    ...appointmentData,
    createdAt: new Date().toISOString(),
    status: 'confirmed'
  };
  
  const updatedClients = clients.map(client => 
    client.id === clientId 
      ? { 
          ...client, 
          appointments: [...(client.appointments || []), newAppointment] 
        }
      : client
  );
  
  setClients(updatedClients);
  localStorage.setItem("clients", JSON.stringify(updatedClients));
  return newAppointment;
};

// Aktualizuj wizytę
export const updateAppointment = (clientId, appointmentId, updatedData, clients, setClients) => {
  const updatedClients = clients.map(client => 
    client.id === clientId 
      ? {
          ...client,
          appointments: (client.appointments || []).map(apt => 
            apt.id === appointmentId ? { ...apt, ...updatedData } : apt
          )
        }
      : client
  );
  
  setClients(updatedClients);
  localStorage.setItem("clients", JSON.stringify(updatedClients));
};

// Usuń wizytę
export const deleteAppointment = (clientId, appointmentId, clients, setClients) => {
  const updatedClients = clients.map(client => 
    client.id === clientId 
      ? {
          ...client,
          appointments: (client.appointments || []).filter(apt => apt.id !== appointmentId)
        }
      : client
  );
  
  setClients(updatedClients);
  localStorage.setItem("clients", JSON.stringify(updatedClients));
};

// Pobierz wizyty na konkretny dzień
export const getAppointmentsForDate = (date, userId, clients) => {
  const allAppointments = getAppointmentsForUser(userId, clients);
  return allAppointments.filter(apt => apt.date === date);
};

// Pobierz nadchodzące wizyty (dzisiaj i później)
export const getUpcomingAppointments = (userId, clients) => {
  const allAppointments = getAppointmentsForUser(userId, clients);
  const today = new Date().toISOString().split('T')[0];
  
  return allAppointments
    .filter(apt => apt.date >= today)
    .sort((a, b) => {
      if (a.date === b.date) {
        return a.time.localeCompare(b.time);
      }
      return a.date.localeCompare(b.date);
    });
}; 