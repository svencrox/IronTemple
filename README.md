# IronTemple - Fitness Tracker

**Temple of Iron** is a fitness tracking web application that helps you stay motivated and achieve your fitness goals with personalized workouts, progress tracking, and community support.

## Features

### Authentication & Onboarding

-   **User Authentication**: Secure signup and login functionality
-   **Guest Mode**: Start using the app immediately without creating an account
-   **Guest-to-User Migration**: Seamlessly upgrade from guest to authenticated user while preserving all workout data
-   **Personalized Onboarding**: Set your fitness goals, experience level, and workout preferences

### Workout Tracking

-   **Offline-First Architecture**: Track workouts without internet - syncs automatically when online
-   **Guest Mode Support**: Use the app offline as a guest, upgrade to account anytime
-   **Automatic Sync**: Background sync when connection is restored
-   **Sync Queue Management**: Retry logic with up to 3 attempts for failed syncs
-   **Workout Logger**: Log exercises with sets, reps, and weight tracking
-   **Dynamic Exercise Management**: Add/remove exercises and sets on the fly
-   **Workout History**: Browse all workouts with filtering (All, This Week, This Month)
-   **Search Functionality**: Find workouts by name, exercise, or notes
-   **Progress Dashboard**: View workout statistics and recent activity
-   **Edit & Delete**: Full workout management capabilities
-   **Sync Status Indicator**: Real-time sync status with manual sync option
-   **Error Handling**: Comprehensive storage error handling with user feedback

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
│   ├── HomePage.js           # Landing page with guest mode CTA
│   ├── SignUp.js             # User registration with guest migration
│   ├── Login.js              # User login with guest migration
│   ├── GetStarted.js         # Onboarding/preferences form
│   ├── Dashboard.js          # Main dashboard with stats & guest mode banner
│   ├── WorkoutLogger.js      # Create/edit workout with exercises & sets
│   ├── WorkoutHistory.js     # Browse all workouts with filters & search
│   ├── WorkoutDetail.js      # View single workout details
│   └── common/
│       ├── WorkoutCard.js        # Reusable workout card component
│       ├── SyncStatusIndicator.js # Sync status badge with click-to-sync
│       ├── ExerciseForm.js       # Dynamic exercise input form
│       └── SetRow.js             # Individual set input row
├── constants/
│   ├── syncConstants.js      # Sync status, actions, and retry constants
│   └── storageKeys.js        # LocalStorage key constants
├── context/
│   └── SyncContext.js        # Global sync state with race condition prevention
├── service/
│   ├── authService.js        # Authentication with guest mode support
│   ├── trackingService.js    # Workout CRUD with error handling
│   ├── syncService.js        # Offline-first sync with queue management
│   └── storageService.js     # LocalStorage helper utilities
├── utils/
│   └── guestMigration.js     # Guest-to-user migration helper
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

## Offline-First Architecture

### Guest Mode
- Use the app immediately without creating an account
- All workouts stored locally on your device
- Upgrade to account anytime to sync across devices

### Data Sync
- **Automatic sync** when online and authenticated
- **Sync queue** manages pending, failed, and successful syncs
- **Retry logic** with up to 3 attempts for failed operations
- **Race condition prevention** ensures only one sync runs at a time
- **Guest migration** seamlessly transfers local workouts when upgrading to account

### Storage
- All workout data stored in **localStorage**
- Centralized storage service with error handling
- Constants-based storage keys for maintainability
- Comprehensive error messages for storage failures

### Code Quality
- **Constants**: Centralized configuration for retry counts, sync statuses, and storage keys
- **Error Handling**: All storage operations check for failures
- **DRY Principles**: Shared utilities eliminate code duplication
- **Type Safety**: Constants prevent typos and improve refactoring

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Copyright 2024 Temple of Iron. All rights reserved.
