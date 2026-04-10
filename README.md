# IronTemple - Fitness Tracker

**IronTemple** is an offline-first fitness tracking web app that lets you log workouts, track progress, and stay consistent — no internet connection required.

Live: [svencrox.github.io/IronTemple](https://svencrox.github.io/IronTemple)

## Features

### Authentication & Onboarding
- **Guest Mode** — start tracking immediately, no account needed
- **Sign Up / Login** — create a local account; credentials are stored on-device
- **Guest-to-User Migration** — upgrade from guest to account without losing workout data
- **Fitness Preferences** — set your goal, experience level, and workout type on first launch

### Workout Tracking
- **Workout Logger** — log exercises with sets, reps, and weight
- **Auto-select inputs** — tapping a reps/weight field highlights the value for instant replacement
- **Workout History** — browse all workouts with filters (All, This Week, This Month) and search
- **Workout Detail** — view full breakdown of exercises, sets, volume per exercise
- **Edit & Delete** — full workout management
- **Progress Dashboard** — total workouts, weekly activity, and total volume at a glance

### Offline-First
- All data stored in **localStorage** — works with no internet connection
- No backend dependency — the app is fully self-contained in the browser
- Backend sync is planned for a future release

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS v3 |
| Notifications | React Toastify |
| State | React Context API |
| Storage | localStorage |
| ID Generation | UUID |
| Build | Create React App |
| Deployment | GitHub Pages |

## Getting Started

### Prerequisites
- Node.js v14 or higher
- npm

### Install & run

```bash
git clone https://github.com/svencrox/IronTemple.git
cd IronTemple
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

### Available scripts

```bash
npm start       # Dev server
npm test        # Run tests
npm run build   # Production build → /build
```

## Project Structure

```
src/
├── components/
│   ├── HomePage.js           # Landing page
│   ├── GetStarted.js         # Fitness preferences onboarding
│   ├── SignUp.js             # Registration
│   ├── Login.js              # Login
│   ├── Dashboard.js          # Stats, recent workouts, quick actions
│   ├── WorkoutLogger.js      # Create / edit workout
│   ├── WorkoutHistory.js     # Browse & search all workouts
│   ├── WorkoutDetail.js      # Single workout breakdown
│   └── common/
│       ├── ExerciseForm.js         # Exercise input with dynamic sets
│       ├── SetRow.js               # Reps / weight input row
│       ├── WorkoutCard.js          # Workout summary card
│       └── SyncStatusIndicator.js  # Sync badge (reserved for backend)
├── constants/
│   ├── storageKeys.js        # localStorage key constants
│   └── syncConstants.js      # Sync status and action constants
├── context/
│   └── SyncContext.js        # Global online/sync state
├── service/
│   ├── authService.js        # Local auth — register, login, guest mode
│   ├── storageService.js     # localStorage helpers
│   ├── trackingService.js    # Workout CRUD
│   └── syncService.js        # Sync interface (no-op until backend ready)
├── utils/
│   └── guestMigration.js     # Guest workout migration on account upgrade
├── App.js
└── index.js
```

## Deployment

The app deploys to GitHub Pages via GitHub Actions on every push to `master`.

The workflow (`.github/workflows/deploy.yml`):
1. Installs dependencies
2. Runs tests
3. Configures Pages base path
4. Builds with `npm run build`
5. Deploys the `build/` folder

Environment configuration:
- `.env` — production defaults (`REACT_APP_BASENAME=/IronTemple`)
- `.env.development` — local overrides (`PUBLIC_URL=/`, `REACT_APP_BASENAME=`)

## Roadmap

- [ ] Backend API integration (auth, workout sync)
- [ ] Password hashing (currently plaintext in localStorage)
- [ ] User profiles to store unit / weight preference (lbs / kg toggle) and motivations
- [ ] Workout templates
- [ ] Progress charts

## License

Copyright 2024 IronTemple. All rights reserved.
