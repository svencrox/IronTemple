import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, continueAsGuest, isGuestUser } from '../service/authService';
import { migrateGuestWorkouts } from '../utils/guestMigration';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const wasGuest = isGuestUser();

    try {
      const response = await login(formData.email, formData.password);
      console.log('User logged in:', response);

      toast.success('Login successful! Redirecting to dashboard...');

      // If user was a guest, migrate their local workouts to their account
      if (wasGuest) {
        const userId = response.data.id || response.data._id;
        await migrateGuestWorkouts(wasGuest, userId);
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      setIsSubmitting(false);

      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || 'Login failed. Please try again.';

      toast.error(errorMessage);
    }
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    toast.info('Continuing as guest. Create an account to sync your data across devices.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div className='flex justify-between mb-6'>
            <h2 className="text-2xl font-bold text-gray-900">Login</h2>
            <Link className='border-solid rounded border px-2 content-evenly' to='/'>Back</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleContinueAsGuest}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Continue as Guest
          </button>
        </div>
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
