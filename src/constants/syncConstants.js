// Sync Configuration Constants

/**
 * Maximum number of retry attempts for failed sync operations
 */
export const MAX_RETRY_COUNT = 3;

/**
 * Sync status values
 */
export const SYNC_STATUS = {
  SYNCED: 'synced',
  PENDING: 'pending',
  FAILED: 'failed',
  SYNCING: 'syncing',
  OFFLINE: 'offline'
};

/**
 * Sync action types
 */
export const SYNC_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete'
};
