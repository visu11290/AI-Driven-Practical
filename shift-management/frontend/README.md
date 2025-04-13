# Shift Management System - Frontend

This is the frontend application for the Shift Management System built with React, TypeScript, and Material-UI.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

The application will start at http://localhost:3000

## Features

- Create, read, update, and delete shifts
- Multiple date selection for shifts
- Time and price management for each shift date
- Type selection (Consultation, Telephone, Ambulance)
- Price range filter using a dynamic slider
- Type filter
- Modern and responsive UI with Material-UI
- Form validation
- Time overlap validation
- Redux state management

## Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the application for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Project Structure

```
src/
  ├── components/          # React components
  │   ├── ShiftCard.tsx   # Component for displaying a shift
  │   └── ShiftDrawer.tsx # Component for creating/editing shifts
  ├── store/              # Redux store configuration
  │   ├── store.ts        # Store setup
  │   └── shiftSlice.ts   # Shift-related actions and reducers
  ├── types/              # TypeScript type definitions
  │   └── shift.ts        # Shift-related types
  ├── App.tsx             # Main application component
  └── index.tsx           # Application entry point
```

## Dependencies

- React 18
- TypeScript
- Material-UI
- Redux Toolkit
- React Redux
- Date-fns
- Axios

## API Integration

The frontend communicates with the backend API running at http://localhost:3000. Make sure the backend server is running before starting the frontend application. 