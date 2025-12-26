import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSyncQueueStatus } from '../service/trackingService';
import { syncWorkouts } from '../service/syncService';

const SyncContext = createContext();

export const SyncProvider = ({ children }) => {
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced', 'syncing', 'failed', 'offline'
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Update sync status from storage
  const updateSyncStatus = useCallback(() => {
    const status = getSyncQueueStatus();
    setPendingCount(status.pending);
    setFailedCount(status.failed);

    if (!navigator.onLine) {
      setSyncStatus('offline');
    } else if (status.failed > 0) {
      setSyncStatus('failed');
    } else if (status.pending > 0) {
      setSyncStatus('pending');
    } else {
      setSyncStatus('synced');
    }
  }, []);

  // Trigger sync with actual syncService
  const triggerSync = useCallback(async () => {
    if (!navigator.onLine) {
      return { success: false, reason: 'offline' };
    }

    // Prevent concurrent sync attempts
    if (isSyncing) {
      console.log('Sync already in progress, skipping...');
      return { success: false, reason: 'already_syncing' };
    }

    setIsSyncing(true);
    setSyncStatus('syncing');

    try {
      const result = await syncWorkouts();
      updateSyncStatus();
      return result;
    } catch (error) {
      console.error('Sync error:', error);
      updateSyncStatus();
      return { success: false, error: error.message };
    } finally {
      setIsSyncing(false);
    }
  }, [updateSyncStatus, isSyncing]);

  // Setup network listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    const handleWorkoutChanged = () => {
      updateSyncStatus();
      // Trigger sync if online
      if (navigator.onLine) {
        triggerSync();
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('workout-changed', handleWorkoutChanged);

    // Initial status update
    updateSyncStatus();

    // Periodic status check (every 5 seconds)
    const interval = setInterval(() => {
      updateSyncStatus();
    }, 5000);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('workout-changed', handleWorkoutChanged);
      clearInterval(interval);
    };
  }, [triggerSync, updateSyncStatus]);

  const value = {
    syncStatus,
    isOnline,
    pendingCount,
    failedCount,
    triggerSync,
    updateSyncStatus
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
};

// Custom hook to use sync context
export const useSyncContext = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
};
