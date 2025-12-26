import axios from 'axios';
import { getItem, setItem } from './storageService';
import { getCurrentUser } from './authService';
import { MAX_RETRY_COUNT, SYNC_ACTIONS } from '../constants/syncConstants';
import { WORKOUTS_STORAGE_KEY } from '../constants/storageKeys';

const API_URL = 'http://localhost:5000/api/';

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

/**
 * Check if online
 * @returns {boolean} Online status
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Get sync queue status
 * @returns {Object} Sync status information
 */
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

/**
 * Remove item from sync queue
 * @param {string} workoutId - Workout ID
 */
const removeFromSyncQueue = (workoutId) => {
  const storage = getWorkoutsFromStorage();
  storage.syncQueue = storage.syncQueue.filter(item => item.workoutId !== workoutId);
  saveWorkoutsToStorage(storage);
};

/**
 * Update sync queue item retry count
 * @param {string} workoutId - Workout ID
 * @param {string} error - Error message
 */
const incrementRetryCount = (workoutId, error) => {
  const storage = getWorkoutsFromStorage();
  const queueItem = storage.syncQueue.find(item => item.workoutId === workoutId);

  if (queueItem) {
    queueItem.retryCount++;
    queueItem.lastError = error;
  }

  saveWorkoutsToStorage(storage);
};

/**
 * Sync a single workout to the server
 * @param {string} workoutId - Workout ID
 * @param {string} action - Action type (create, update, delete)
 * @returns {Promise<Object>} Sync result
 */
const syncSingleWorkout = async (workoutId, action) => {
  const storage = getWorkoutsFromStorage();
  const workout = storage.workouts[workoutId];
  const user = getCurrentUser();

  if (!user || !user.token) {
    throw new Error('Not authenticated');
  }

  const config = {
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    }
  };

  let response;

  switch (action) {
    case SYNC_ACTIONS.CREATE:
      if (!workout) {
        throw new Error('Workout not found');
      }
      // Send workout to server
      response = await axios.post(
        `${API_URL}workouts`,
        {
          clientId: workout.id,
          name: workout.name,
          date: workout.date,
          exercises: workout.exercises,
          notes: workout.notes,
          duration: workout.duration
        },
        config
      );
      break;

    case SYNC_ACTIONS.UPDATE:
      if (!workout) {
        throw new Error('Workout not found');
      }
      response = await axios.put(
        `${API_URL}workouts/${workout.id}`,
        {
          clientId: workout.id,
          name: workout.name,
          date: workout.date,
          exercises: workout.exercises,
          notes: workout.notes,
          duration: workout.duration
        },
        config
      );
      break;

    case SYNC_ACTIONS.DELETE:
      response = await axios.delete(
        `${API_URL}workouts/${workoutId}`,
        config
      );
      break;

    default:
      throw new Error(`Unknown action: ${action}`);
  }

  return response.data;
};

/**
 * Sync all pending workouts
 * @returns {Promise<Object>} Sync result
 */
export const syncWorkouts = async () => {
  if (!isOnline()) {
    console.log('Offline - skipping sync');
    return { success: false, reason: 'offline', synced: 0, failed: 0 };
  }

  const user = getCurrentUser();
  if (!user) {
    console.log('Not authenticated - skipping sync');
    return { success: false, reason: 'not_authenticated', synced: 0, failed: 0 };
  }

  const storage = getWorkoutsFromStorage();
  const { syncQueue } = storage;

  if (syncQueue.length === 0) {
    return { success: true, synced: 0, failed: 0 };
  }

  let syncedCount = 0;
  let failedCount = 0;

  // Process queue items sequentially
  for (const queueItem of [...syncQueue]) {
    // Skip items that have failed too many times
    if (queueItem.retryCount >= MAX_RETRY_COUNT) {
      failedCount++;
      continue;
    }

    try {
      await syncSingleWorkout(queueItem.workoutId, queueItem.action);

      // Success - update local data
      const workout = storage.workouts[queueItem.workoutId];

      if (queueItem.action === SYNC_ACTIONS.DELETE) {
        // Remove deleted workout from storage
        delete storage.workouts[queueItem.workoutId];
      } else if (workout) {
        // Mark as synced
        workout.syncStatus = 'synced';
        workout.serverSyncedAt = new Date().toISOString();
        storage.workouts[queueItem.workoutId] = workout;
      }

      // Remove from sync queue
      removeFromSyncQueue(queueItem.workoutId);
      syncedCount++;

    } catch (error) {
      console.error(`Error syncing workout ${queueItem.workoutId}:`, error);

      // Increment retry count
      incrementRetryCount(queueItem.workoutId, error.message);

      // Update workout sync status
      const workout = storage.workouts[queueItem.workoutId];
      if (workout) {
        workout.syncStatus = queueItem.retryCount >= (MAX_RETRY_COUNT - 1) ? 'failed' : 'pending';
        storage.workouts[queueItem.workoutId] = workout;
      }

      failedCount++;
    }
  }

  // Update last sync timestamp
  storage.lastSyncTimestamp = new Date().toISOString();
  saveWorkoutsToStorage(storage);

  // Dispatch event to update UI
  window.dispatchEvent(new CustomEvent('sync-completed', {
    detail: { synced: syncedCount, failed: failedCount }
  }));

  return {
    success: failedCount === 0,
    synced: syncedCount,
    failed: failedCount
  };
};

/**
 * Setup network listeners for auto-sync
 */
export const setupNetworkListeners = () => {
  const handleOnline = () => {
    console.log('Network reconnected - triggering sync');
    syncWorkouts();
  };

  const handleOffline = () => {
    console.log('Network disconnected');
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * Retry failed syncs
 * @returns {Promise<Object>} Retry result
 */
export const retryFailedSyncs = async () => {
  const storage = getWorkoutsFromStorage();

  // Reset retry count for failed items
  storage.syncQueue.forEach(item => {
    if (item.retryCount >= MAX_RETRY_COUNT) {
      item.retryCount = 0;
      item.lastError = null;
    }
  });

  saveWorkoutsToStorage(storage);

  // Trigger sync
  return await syncWorkouts();
};

/**
 * Clear all sync queue items
 */
export const clearSyncQueue = () => {
  const storage = getWorkoutsFromStorage();
  storage.syncQueue = [];
  saveWorkoutsToStorage(storage);
};

/**
 * Update all workout userIds (useful when guest upgrades to account)
 * @param {string} newUserId - The new user ID to assign to all workouts
 * @returns {number} Number of workouts updated
 */
export const updateWorkoutsUserId = (newUserId) => {
  const storage = getWorkoutsFromStorage();
  let updatedCount = 0;

  // Update userId for all workouts
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

/**
 * Queue all local workouts for sync (useful when guest upgrades to account)
 * @returns {number} Number of workouts queued
 */
export const queueAllWorkoutsForSync = () => {
  const storage = getWorkoutsFromStorage();
  let queuedCount = 0;

  // Queue all workouts that aren't already synced
  Object.keys(storage.workouts).forEach(workoutId => {
    const workout = storage.workouts[workoutId];

    // Only queue if not already synced or in queue
    if (workout.syncStatus !== 'synced') {
      const existingInQueue = storage.syncQueue.find(item => item.workoutId === workoutId);

      if (!existingInQueue) {
        storage.syncQueue.push({
          workoutId,
          action: SYNC_ACTIONS.CREATE,
          timestamp: new Date().toISOString(),
          retryCount: 0,
          lastError: null
        });
        queuedCount++;
      }
    }
  });

  if (queuedCount > 0) {
    saveWorkoutsToStorage(storage);
  }

  return queuedCount;
};
