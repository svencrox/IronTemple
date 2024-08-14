import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App.js';

test('renders the HomePage with navigation links', () => {
  render(<App />);
  expect(screen.getByText(/Fitness Tracker/i)).toBeInTheDocument();
  expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('renders the Sign Up page when clicking the Sign Up link', () => {
  render(<App />);
  const signUpLink = screen.getByText(/Sign Up/i);
  signUpLink.click();
  expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
});

test('renders the Login page when clicking the Login link', () => {
  render(<App />);
  const loginLink = screen.getByText(/Login/i);
  loginLink.click();
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});
