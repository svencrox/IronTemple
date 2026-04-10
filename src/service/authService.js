import { USER_STORAGE_KEY, USERS_STORAGE_KEY } from '../constants/storageKeys';

// Registered users store — keyed by email
const getUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Create a guest user for offline usage
export const createGuestUser = () => {
  const guestUser = {
    id: `guest_${Date.now()}`,
    name: 'Guest User',
    email: null,
    isGuest: true,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(guestUser));
  return guestUser;
};

// Check if current user is a guest
export const isGuestUser = () => {
  const user = getCurrentUser();
  return user && user.isGuest === true;
};

// Register a new user (local-only, no backend)
export const register = async (name, email, password) => {
  const wasGuest = isGuestUser();
  const users = getUsers();

  if (users[email]) {
    throw new Error('An account with this email already exists');
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    isGuest: false,
    upgradedFromGuest: wasGuest,
    createdAt: new Date().toISOString(),
  };

  // Persist credentials locally so login can validate
  users[email] = { ...newUser, password };
  saveUsers(users);

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
};

// Login existing user (local-only, no backend)
export const login = async (email, password) => {
  const wasGuest = isGuestUser();
  const users = getUsers();

  const stored = users[email];
  if (!stored) {
    throw new Error('No account found with this email');
  }
  if (stored.password !== password) {
    throw new Error('Incorrect password');
  }

  const { password: _omit, ...user } = stored;
  const sessionUser = { ...user, upgradedFromGuest: wasGuest };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sessionUser));
  return sessionUser;
};

// Logout user (removes from localStorage)
export const logout = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Continue as guest without authentication
export const continueAsGuest = () => {
  const existingUser = getCurrentUser();
  if (existingUser) {
    return existingUser;
  }
  return createGuestUser();
};
