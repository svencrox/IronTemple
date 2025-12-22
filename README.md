# IronTemple - Fitness Tracker

**Temple of Iron** is a fitness tracking web application that helps you stay motivated and achieve your fitness goals with personalized workouts, progress tracking, and community support.

## Features

### Authentication & Onboarding

-   **User Authentication**: Secure signup and login functionality
-   **Personalized Onboarding**: Set your fitness goals, experience level, and workout preferences

### Workout Tracking

-   **Offline-First**: Track workouts without internet - syncs automatically when online
-   **Workout Logger**: Log exercises with sets, reps, and weight tracking
-   **Dynamic Exercise Management**: Add/remove exercises and sets on the fly
-   **Workout History**: Browse all workouts with filtering (All, This Week, This Month)
-   **Search Functionality**: Find workouts by name, exercise, or notes
-   **Progress Dashboard**: View workout statistics and recent activity
-   **Edit & Delete**: Full workout management capabilities
-   **Sync Status Indicator**: Real-time sync status with manual sync option

## Tech Stack

-   **Frontend**: React 18
-   **Routing**: React Router DOM v6
-   **Styling**: Tailwind CSS
-   **HTTP Client**: Axios
-   **Notifications**: React Toastify
-   **State Management**: React Context API
-   **Storage**: LocalStorage (offline-first)
-   **ID Generation**: UUID
-   **Build Tool**: Create React App

## Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn
-   Backend API server running on `http://localhost:5000`

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd IronTemple
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

The page will reload when you make changes.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

The build is optimized for the best performance, with minified files and hashed filenames.

## Project Structure

```
src/
├── components/
│   ├── HomePage.js           # Landing page with features
│   ├── SignUp.js             # User registration
│   ├── Login.js              # User login
│   ├── GetStarted.js         # Onboarding/preferences form
│   ├── Dashboard.js          # Main dashboard with stats & recent workouts
│   ├── WorkoutLogger.js      # Create/edit workout with exercises & sets
│   ├── WorkoutHistory.js     # Browse all workouts with filters & search
│   ├── WorkoutDetail.js      # View single workout details
│   └── common/
│       ├── WorkoutCard.js        # Reusable workout card component
│       ├── SyncStatusIndicator.js # Sync status badge
│       ├── ExerciseForm.js       # Dynamic exercise input form
│       └── SetRow.js             # Individual set input row
├── context/
│   └── SyncContext.js        # Global sync state management
├── service/
│   ├── authService.js        # Authentication API integration
│   ├── trackingService.js    # Workout CRUD operations
│   ├── syncService.js        # Offline-first sync engine
│   └── storageService.js     # LocalStorage helper utilities
├── App.js                    # Main app with routing & SyncProvider
└── index.js                  # Entry point
```

## API Configuration

The app expects a backend API running at `http://localhost:5000` with the following endpoints:

### Authentication Endpoints

-   `POST /api/auth/register` - User registration
-   `POST /api/auth/login` - User login

### Workout Endpoints (To Be Implemented)

-   `POST /api/workouts` - Create new workout
-   `GET /api/workouts` - Get user's workouts
-   `GET /api/workouts/:id` - Get single workout
-   `PUT /api/workouts/:id` - Update workout
-   `DELETE /api/workouts/:id` - Delete workout
-   `GET /api/workouts/stats` - Get workout statistics

### User Preferences Endpoint (To Be Implemented)

-   `PUT /api/users/preferences` - Save user fitness preferences

To change the API URL, update the `API_URL` constants in:

-   `src/service/authService.js`
-   `src/service/syncService.js`

**Note**: The app works completely offline! Workout data is stored in localStorage and will sync to the server when the backend API is available and you're online.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Copyright 2024 Temple of Iron. All rights reserved.
