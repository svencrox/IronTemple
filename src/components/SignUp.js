import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, isGuestUser } from '../service/authService';
import { migrateGuestWorkouts } from '../utils/guestMigration';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          error = 'Name must be less than 50 characters';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        } else if (value.length > 100) {
          error = 'Password must be less than 100 characters';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    const wasGuest = isGuestUser();

    try {
      const response = await register(formData.name, formData.email, formData.password);
      console.log('User registered:', response);

      toast.success('Registration successful! Redirecting to dashboard...');

      // If user was a guest, migrate their local workouts to the new account
      if (wasGuest) {
        const userId = response.data.id || response.data._id;
        await migrateGuestWorkouts(wasGuest, userId);
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      setIsSubmitting(false);

      // Extract error message from response
      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || 'Registration failed. Please try again.';

      // Show specific error messages
      if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: 'This email is already registered' });
        toast.error('This email is already registered. Please use a different email or login.');
      } else if (errorMessage.toLowerCase().includes('password')) {
        setErrors({ password: errorMessage });
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className='flex justify-between mb-6'>
            <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
            <Link className='border-solid rounded border px-2 content-evenly' to='/'>Back</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 ${
                touched.name && errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              required
            />
            {touched.name && errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 ${
                touched.email && errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              required
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 ${
                touched.password && errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              required
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            {!errors.password && formData.password && (
              <p className="text-gray-500 text-sm mt-1">
                Must be 6+ characters with uppercase, lowercase, and number
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 ${
                touched.confirmPassword && errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              required
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
