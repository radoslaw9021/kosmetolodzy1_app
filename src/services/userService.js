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