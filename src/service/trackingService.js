import { v4 as uuidv4 } from 'uuid';
import { getItem, setItem } from './storageService';
import { getCurrentUser } from './authService';
import { WORKOUTS_STORAGE_KEY } from '../constants/storageKeys';

// Initialize storage structure
const initializeStorage = () => {
  const existing = getItem(WORKOUTS_STORAGE_KEY);
  if (!existing) {
    const initialData = {
      workouts: {},
      syncQueue: [],
      lastSyncTimestamp: null,
      version: '1.0'
    };
    setItem(WORKOUTS_STORAGE_KEY, initialData);
    return initialData;
  }
  return existing;
};

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

// Add item to sync queue
const addToSyncQueue = (workoutId, action) => {
  const storage = getWorkoutsFromStorage();

  // Check if this workout is already in queue
  const existingIndex = storage.syncQueue.findIndex(
    item => item.workoutId === workoutId
  );

  if (existingIndex !== -1) {
    // Update existing queue item
    storage.syncQueue[existingIndex] = {
      ...storage.syncQueue[existingIndex],
      action,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };
  } else {
    // Add new queue item
    storage.syncQueue.push({
      workoutId,
      action,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      lastError: null
    });
  }

  saveWorkoutsToStorage(storage);
};

/**
 * Create a new workout
 * @param {Object} workoutData - Workout data (name, date, exercises, notes)
 * @returns {Object} Created workout
 */
export const createWorkout = (workoutData) => {
  const storage = getWorkoutsFromStorage();
  const user = getCurrentUser();

  if (!user) {
    throw new Error('User must be logged in to create workouts');
  }

  const workout = {
    id: uuidv4(),
    userId: user.id || user._id,
    name: workoutData.name || 'Untitled Workout',
    date: workoutData.date || new Date().toISOString(),
    exercises: workoutData.exercises || [],
    notes: workoutData.notes || '',
    duration: workoutData.duration || 0,
    syncStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    serverSyncedAt: null
  };

  storage.workouts[workout.id] = workout;
  addToSyncQueue(workout.id, 'create');

  const saved = saveWorkoutsToStorage(storage);
  if (!saved) {
    throw new Error('Failed to save workout. Storage might be full or unavailable.');
  }

  // Trigger sync (will be handled by syncService)
  window.dispatchEvent(new CustomEvent('workout-changed'));

  return workout;
};

/**
 * Get all workouts
 * @returns {Array} Array of workouts sorted by date (most recent first)
 */
export const getAllWorkouts = () => {
  const storage = getWorkoutsFromStorage();
  const workoutsArray = Object.values(storage.workouts);

  // Filter out deleted workouts and sort by date
  return workoutsArray
    .filter(workout => !workout.deleted)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Get workout by ID
 * @param {string} id - Workout ID
 * @returns {Object|null} Workout object or null if not found
 */
export const getWorkoutById = (id) => {
  const storage = getWorkoutsFromStorage();
  const workout = storage.workouts[id];

  if (!workout || workout.deleted) {
    return null;
  }

  return workout;
};

/**
 * Get recent workouts
 * @param {number} limit - Number of workouts to return
 * @returns {Array} Array of recent workouts
 */
export const getRecentWorkouts = (limit = 5) => {
  const allWorkouts = getAllWorkouts();
  return allWorkouts.slice(0, limit);
};

/**
 * Get workouts by date range
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string)
 * @returns {Array} Filtered workouts
 */
export const getWorkoutsByDateRange = (startDate, endDate) => {
  const allWorkouts = getAllWorkouts();
  const start = new Date(startDate);
  const end = new Date(endDate);

  return allWorkouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= start && workoutDate <= end;
  });
};

/**
 * Update a workout
 * @param {string} id - Workout ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated workout
 */
export const updateWorkout = (id, updates) => {
  const storage = getWorkoutsFromStorage();
  const workout = storage.workouts[id];

  if (!workout || workout.deleted) {
    throw new Error('Workout not found');
  }

  const updatedWorkout = {
    ...workout,
    ...updates,
    id, // Prevent ID from being changed
    updatedAt: new Date().toISOString(),
    syncStatus: 'pending'
  };

  storage.workouts[id] = updatedWorkout;
  addToSyncQueue(id, 'update');

  const saved = saveWorkoutsToStorage(storage);
  if (!saved) {
    throw new Error('Failed to update workout. Storage might be full or unavailable.');
  }

  window.dispatchEvent(new CustomEvent('workout-changed'));

  return updatedWorkout;
};

/**
 * Delete a workout
 * @param {string} id - Workout ID
 * @returns {boolean} Success status
 */
export const deleteWorkout = (id) => {
  const storage = getWorkoutsFromStorage();
  const workout = storage.workouts[id];

  if (!workout) {
    throw new Error('Workout not found');
  }

  // Soft delete - mark as deleted but keep in storage for sync
  storage.workouts[id] = {
    ...workout,
    deleted: true,
    deletedAt: new Date().toISOString(),
    syncStatus: 'pending'
  };

  addToSyncQueue(id, 'delete');

  const saved = saveWorkoutsToStorage(storage);
  if (!saved) {
    throw new Error('Failed to delete workout. Storage might be full or unavailable.');
  }

  window.dispatchEvent(new CustomEvent('workout-changed'));

  return true;
};

/**
 * Add exercise to workout
 * @param {string} workoutId - Workout ID
 * @param {Object} exerciseData - Exercise data
 * @returns {Object} Updated workout
 */
export const addExerciseToWorkout = (workoutId, exerciseData) => {
  const storage = getWorkoutsFromStorage();
  const workout = storage.workouts[workoutId];

  if (!workout || workout.deleted) {
    throw new Error('Workout not found');
  }

  const exercise = {
    id: uuidv4(),
    workoutId,
    name: exerciseData.name || 'Untitled Exercise',
    sets: exerciseData.sets || [],
    notes: exerciseData.notes || '',
    order: exerciseData.order !== undefined ? exerciseData.order : workout.exercises.length
  };

  workout.exercises.push(exercise);
  workout.updatedAt = new Date().toISOString();
  workout.syncStatus = 'pending';

  storage.workouts[workoutId] = workout;
  addToSyncQueue(workoutId, 'update');

  const saved = saveWorkoutsToStorage(storage);
  if (!saved) {
    throw new Error('Failed to add exercise. Storage might be full or unavailable.');
  }

  window.dispatchEvent(new CustomEvent('workout-changed'));

  return workout;
};

/**
 * Add set to exercise
 * @param {string} workoutId - Workout ID
 * @param {string} exerciseId - Exercise ID
 * @param {Object} setData - Set data
 * @returns {Object} Updated workout
 */
export const addSetToExercise = (workoutId, exerciseId, setData) => {
  const storage = getWorkoutsFromStorage();
  const workout = storage.workouts[workoutId];

  if (!workout || workout.deleted) {
    throw new Error('Workout not found');
  }

  const exercise = workout.exercises.find(ex => ex.id === exerciseId);
  if (!exercise) {
    throw new Error('Exercise not found');
  }

  const set = {
    id: uuidv4(),
    exerciseId,
    setNumber: setData.setNumber || exercise.sets.length + 1,
    reps: setData.reps || 0,
    weight: setData.weight || 0,
    completed: setData.completed !== undefined ? setData.completed : true,
    order: setData.order !== undefined ? setData.order : exercise.sets.length
  };

  exercise.sets.push(set);
  workout.updatedAt = new Date().toISOString();
  workout.syncStatus = 'pending';

  storage.workouts[workoutId] = workout;
  addToSyncQueue(workoutId, 'update');

  const saved = saveWorkoutsToStorage(storage);
  if (!saved) {
    throw new Error('Failed to add set. Storage might be full or unavailable.');
  }

  window.dispatchEvent(new CustomEvent('workout-changed'));

  return workout;
};

/**
 * Get workout statistics
 * @returns {Object} Workout stats
 */
export const getWorkoutStats = () => {
  const allWorkouts = getAllWorkouts();

  // Get workouts from this week
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const thisWeekWorkouts = allWorkouts.filter(
    workout => new Date(workout.date) >= weekStart
  );

  // Calculate total volume (sets * reps * weight)
  let totalVolume = 0;
  allWorkouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed) {
          totalVolume += set.reps * set.weight;
        }
      });
    });
  });

  return {
    totalWorkouts: allWorkouts.length,
    workoutsThisWeek: thisWeekWorkouts.length,
    totalVolume,
    averageWorkoutsPerWeek: allWorkouts.length > 0 ? (allWorkouts.length / 4).toFixed(1) : 0
  };
};

/**
 * Get sync queue status
 * @returns {Object} Sync status
 */
export const getSyncQueueStatus = () => {
  const storage = getWorkoutsFromStorage();

  const pending = storage.syncQueue.filter(item => item.retryCount < 3).length;
  const failed = storage.syncQueue.filter(item => item.retryCount >= 3).length;

  return {
    pending,
    failed,
    total: storage.syncQueue.length,
    lastSyncTimestamp: storage.lastSyncTimestamp
  };
};

// Initialize storage on module load
initializeStorage();
