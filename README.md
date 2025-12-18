# IronTemple - Fitness Tracker

**Temple of Iron** is a fitness tracking web application that helps you stay motivated and achieve your fitness goals with personalized workouts, progress tracking, and community support.

## Features

- **User Authentication**: Secure signup and login functionality
- **Personalized Workouts**: Get workout routines tailored to your fitness level and goals
- **Progress Tracking**: Monitor your progress and stay on track with your fitness journey
- **Community Support**: Join a community of like-minded individuals to stay motivated

## Tech Stack

- **Frontend**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Build Tool**: Create React App

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running on `http://localhost:5000`

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
│   ├── HomePage.js      # Landing page with features
│   ├── SignUp.js        # User registration
│   ├── Login.js         # User login
│   └── GetStarted.js    # Onboarding page
├── service/
│   └── authService.js   # Authentication API integration
├── App.js               # Main app with routing
└── index.js             # Entry point
```

## API Configuration

The app expects a backend API running at `http://localhost:5000` with the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

To change the API URL, update the `API_URL` in `src/service/authService.js`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Copyright 2024 Temple of Iron. All rights reserved.
