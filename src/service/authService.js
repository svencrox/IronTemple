import axios from 'axios';
import { USER_STORAGE_KEY } from '../constants/storageKeys';

const API_URL = 'http://localhost:5000/api/auth/';

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

// Register a new user (handles guest data migration)
export const register = async (name, email, password) => {
  const wasGuest = isGuestUser();

  const response = await axios.post(API_URL + 'register', {
    name,
    email,
    password,
  });

  if (response.data.token) {
    const newUser = {
      ...response.data,
      isGuest: false,
      upgradedFromGuest: wasGuest,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
  }

  return response.data;
};

// Login existing user (handles guest data migration)
export const login = async (email, password) => {
  const wasGuest = isGuestUser();

  const response = await axios.post(API_URL + 'login', {
    email,
    password,
  });

  if (response.data.token) {
    const user = {
      ...response.data,
      isGuest: false,
      upgradedFromGuest: wasGuest,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  return response.data;
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
