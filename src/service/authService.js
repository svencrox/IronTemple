import { USER_STORAGE_KEY } from '../constants/storageKeys';

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

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    isGuest: false,
    upgradedFromGuest: wasGuest,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
};

// Login existing user (local-only, no backend)
export const login = async (email, password) => {
  const wasGuest = isGuestUser();

  const user = {
    id: `user_${Date.now()}`,
    name: email.split('@')[0],
    email,
    isGuest: false,
    upgradedFromGuest: wasGuest,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  return user;
};

// Logout user (removes from localStorage)
export const logout = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_STORAGE_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Continue as guest without authentication
export const continueAsGuest = () => {
  const existingUser = getCurrentUser();

  // If already logged in as guest or real user, return existing user
  if (existingUser) {
    return existingUser;
  }

  // Create new guest user
  return createGuestUser();
};
