import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, logout, isGuestUser } from '../service/authService';
import { getRecentWorkouts, getWorkoutStats } from '../service/trackingService';
import { useSyncContext } from '../context/SyncContext';
import SyncStatusIndicator from './common/SyncStatusIndicator';
import WorkoutCard from './common/WorkoutCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { updateSyncStatus } = useSyncContext();
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const recentWorkouts = getRecentWorkouts(5);
      const workoutStats = getWorkoutStats();

      setWorkouts(recentWorkouts);
      setStats(workoutStats);
      updateSyncStatus();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [updateSyncStatus]);

  useEffect(() => {
    // Check authentication
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }

    setUser(currentUser);
    setIsGuest(isGuestUser());
    loadDashboardData();
  }, [navigate, loadDashboardData]);

  const handleLogout = () => {
    logout();
    // Guest users should go to home page, authenticated users to login
    navigate(isGuest ? '/' : '/login');
  };

  const handleStartWorkout = () => {
    navigate('/workout/new');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.name || 'User'}
              </h1>
              <p className="text-sm text-gray-500">Track your fitness journey</p>
            </div>
            <div className="flex items-center gap-4">
              {!isGuest && <SyncStatusIndicator />}
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Guest Mode Banner */}
        {isGuest && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-blue-700">
                  You're using guest mode. Your workouts are saved locally on this device.{' '}
                  <Link to="/signup" className="font-medium underline hover:text-blue-800">
                    Create an account
                  </Link>
                  {' '}to sync your data across devices and never lose your progress.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">
                Total Workouts
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalWorkouts}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">
                This Week
              </div>
              <div className="text-3xl font-bold text-green-600">
                {stats.workoutsThisWeek}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-2">
                Total Volume (lbs)
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalVolume.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleStartWorkout}
            className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-lg font-semibold">Start New Workout</span>
          </button>
          <button
            onClick={handleViewHistory}
            className="bg-white border-2 border-blue-600 text-blue-600 p-6 rounded-lg shadow hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-semibold">View History</span>
          </button>
        </div>

        {/* Recent Workouts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Workouts</h2>
          </div>
          <div className="p-6">
            {workouts.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first workout.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleStartWorkout}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Start Your First Workout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {workouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
                {workouts.length >= 5 && (
                  <div className="text-center pt-4">
                    <Link
                      to="/history"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All Workouts →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
