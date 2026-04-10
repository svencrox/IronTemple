import { getItem, setItem } from './storageService';
import { WORKOUTS_STORAGE_KEY } from '../constants/storageKeys';
import { MAX_RETRY_COUNT } from '../constants/syncConstants';

// Get workouts data from storage
const getWorkoutsFromStorage = () => {
  return getItem(WORKOUTS_STORAGE_KEY, {
    workouts: {},
    syncQueue: [],
    lastSyncTimestamp: null,
    version: '1.0'
  });
};

// Save workouts data to storage
const saveWorkoutsToStorage = (data) => {
  return setItem(WORKOUTS_STORAGE_KEY, data);
};

export const isOnline = () => navigator.onLine;

export const getSyncStatus = () => {
  const storage = getWorkoutsFromStorage();
  const pending = storage.syncQueue.filter(item => item.retryCount < MAX_RETRY_COUNT).length;
  const failed = storage.syncQueue.filter(item => item.retryCount >= MAX_RETRY_COUNT).length;

  return {
    pending,
    failed,
    total: storage.syncQueue.length,
    lastSyncTimestamp: storage.lastSyncTimestamp,
    status: failed > 0 ? 'failed' : pending > 0 ? 'pending' : 'synced'
  };
};

// No-op — backend not connected yet, all data lives in localStorage
export const syncWorkouts = async () => {
  return { success: true, synced: 0, failed: 0 };
};

export const setupNetworkListeners = () => {
  const handleOnline = () => console.log('Network reconnected');
  const handleOffline = () => console.log('Network disconnected');

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

export const retryFailedSyncs = async () => {
  return { success: true, synced: 0, failed: 0 };
};

export const clearSyncQueue = () => {
  const storage = getWorkoutsFromStorage();
  storage.syncQueue = [];
  saveWorkoutsToStorage(storage);
};

export const updateWorkoutsUserId = (newUserId) => {
  const storage = getWorkoutsFromStorage();
  let updatedCount = 0;

  Object.keys(storage.workouts).forEach(workoutId => {
    const workout = storage.workouts[workoutId];
    if (workout.userId !== newUserId) {
      storage.workouts[workoutId] = {
        ...workout,
        userId: newUserId,
        updatedAt: new Date().toISOString()
      };
      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    saveWorkoutsToStorage(storage);
  }

  return updatedCount;
};

export const queueAllWorkoutsForSync = () => 0;
