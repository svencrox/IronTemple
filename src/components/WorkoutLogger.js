import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { createWorkout, updateWorkout, getWorkoutById } from '../service/trackingService';
import { getCurrentUser } from '../service/authService';
import { useSyncContext } from '../context/SyncContext';
import ExerciseForm from './common/ExerciseForm';

const WorkoutLogger = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isOnline } = useSyncContext();
  const [saving, setSaving] = useState(false);
  const [workout, setWorkout] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    exercises: [],
    notes: ''
  });

  useEffect(() => {
    // Check authentication
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    // Load existing workout if editing
    if (id) {
      const existingWorkout = getWorkoutById(id);
      if (existingWorkout) {
        setWorkout({
          name: existingWorkout.name,
          date: existingWorkout.date.split('T')[0],
          exercises: existingWorkout.exercises,
          notes: existingWorkout.notes || ''
        });
      } else {
        toast.error('Workout not found');
        navigate('/dashboard');
      }
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout({ ...workout, [name]: value });
  };

  const handleAddExercise = () => {
    const newExercise = {
      id: uuidv4(),
      name: '',
      sets: [],
      notes: '',
      order: workout.exercises.length
    };
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, newExercise]
    });
  };

  const handleRemoveExercise = (exerciseId) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  const handleExerciseChange = (exerciseId, updatedExercise) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.map(ex =>
        ex.id === exerciseId ? updatedExercise : ex
      )
    });
  };

  const validateWorkout = () => {
    if (!workout.name.trim()) {
      toast.error('Please enter a workout name');
      return false;
    }

    if (workout.exercises.length === 0) {
      toast.error('Please add at least one exercise');
      return false;
    }

    for (const exercise of workout.exercises) {
      if (!exercise.name.trim()) {
        toast.error('All exercises must have a name');
        return false;
      }

      if (exercise.sets.length === 0) {
        toast.error(`Exercise "${exercise.name}" must have at least one set`);
        return false;
      }

      for (const set of exercise.sets) {
        if (set.reps <= 0) {
          toast.error(`All sets must have reps greater than 0`);
          return false;
        }
        if (set.weight < 0) {
          toast.error(`Weight cannot be negative`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateWorkout()) {
      return;
    }

    setSaving(true);
    try {
      if (id) {
        // Update existing workout
        updateWorkout(id, workout);
        toast.success('Workout updated successfully!');
      } else {
        // Create new workout
        createWorkout(workout);
        toast.success('Workout saved successfully!');
      }

      if (!isOnline) {
        toast.info('You are offline. Workout will sync when you reconnect.');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Edit Workout' : 'Log New Workout'}
            </h1>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Offline Warning */}
          {!isOnline && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium">You are offline. Workout will be saved locally and synced later.</span>
              </div>
            </div>
          )}

          {/* Workout Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Name *
              </label>
              <input
                type="text"
                name="name"
                value={workout.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Chest Day, Full Body"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={workout.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Exercises</h2>
            <button
              onClick={handleAddExercise}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Exercise
            </button>
          </div>

          {workout.exercises.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No exercises yet</h3>
              <p className="mt-1 text-sm text-gray-500">Click "Add Exercise" to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workout.exercises.map((exercise, index) => (
                <ExerciseForm
                  key={exercise.id}
                  exercise={exercise}
                  exerciseNumber={index + 1}
                  onChange={(updated) => handleExerciseChange(exercise.id, updated)}
                  onRemove={() => handleRemoveExercise(exercise.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={workout.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional notes about this workout..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : id ? 'Update Workout' : 'Save Workout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLogger;
