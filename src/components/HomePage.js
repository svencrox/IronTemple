import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { continueAsGuest } from '../service/authService';

const HomePage = () => {
  const navigate = useNavigate();

  const handleContinueAsGuest = () => {
    continueAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="flex container mx-auto px-4 py-6 justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Fitness Tracker</h1>
            <div className="space-x-4 content-evenly">
            <Link to="/signup" className="text-blue-600 font-semibold">
                Sign Up
            </Link>
            <Link to="/login" className="text-blue-600 font-semibold">
                Login
            </Link>
      </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-bold">Let Us Be The Accountability Partner</h2>
          <p className="mt-4 text-lg">
            Stay motivated and achieve your fitness goals with personalized workouts, progress tracking, and more.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/get-started"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow inline-block hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
            <button
              onClick={handleContinueAsGuest}
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full shadow hover:bg-white hover:text-blue-600 transition"
            >
              Continue as Guest
            </button>
          </div>
          <p className="mt-4 text-sm text-blue-100">
            No account needed - start tracking your workouts offline right away
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 mb-20">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
          Key Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-gray-900">Personalized Workouts</h4>
            <p className="mt-4 text-gray-600">
              Get workout routines tailored to your fitness level and goals.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-gray-900">Progress Tracking</h4>
            <p className="mt-4 text-gray-600">
              Monitor your progress and stay on track with your fitness journey.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-gray-900">Community Support</h4>
            <p className="mt-4 text-gray-600">
              Join a community of like-minded individuals to stay motivated.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Temple of Iron. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
