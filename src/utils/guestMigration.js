import { toast } from 'react-toastify';
import { syncWorkouts, queueAllWorkoutsForSync, updateWorkoutsUserId } from '../service/syncService';

/**
 * Migrate guest user's local workouts to authenticated account
 * @param {boolean} wasGuest - Whether the user was previously a guest
 * @param {string} userId - The new authenticated user's ID
 * @returns {Promise<Object>} Migration result
 */
export const migrateGuestWorkouts = async (wasGuest, userId) => {
  if (!wasGuest) {
    return { migrated: false, count: 0, success: true };
  }

  // Update all workout userIds to match the new authenticated user
  updateWorkoutsUserId(userId);

  const queuedCount = queueAllWorkoutsForSync();

  if (queuedCount === 0) {
    return { migrated: true, count: 0, success: true };
  }

  toast.info(`Syncing ${queuedCount} local workout${queuedCount > 1 ? 's' : ''} to your account...`);

  try {
    await syncWorkouts();
    toast.success('Your workouts have been synced to your account!');
    return { migrated: true, count: queuedCount, success: true };
  } catch (syncError) {
    console.error('Sync error:', syncError);
    toast.warning('Account created but some workouts may not have synced. They will sync automatically when online.');
    return { migrated: true, count: queuedCount, success: false, error: syncError };
  }
};
