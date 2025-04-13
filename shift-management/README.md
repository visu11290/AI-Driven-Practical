# Shift Management System

A full-stack application for managing shifts with multiple dates, built with NestJS and React.

## Features

- Create, read, update, and delete shifts
- Multiple date selection for shifts
- Time and price management for each shift date
- Type selection (Consultation, Telephone, Ambulance)
- Price range filter using a dynamic slider
- Modern and responsive UI with Material-UI
- Form validation
- Time overlap validation
- Redux state management

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Project Structure

```
.
├── backend/              # NestJS backend
│   ├── src/             # Source files
│   │   ├── controllers/ # API controllers
│   │   ├── entities/    # Database entities
│   │   ├── services/    # Business logic
│   │   └── dto/         # Data transfer objects
│   └── package.json     # Backend dependencies
└── frontend/            # React frontend
    ├── src/             # Source files
    │   ├── components/  # React components
    │   ├── store/       # Redux store
    │   └── types/       # TypeScript types
    └── package.json     # Frontend dependencies
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database named 'shift_management'

4. Copy `.env.example` to `.env` and update the database credentials if needed:
   ```bash
   cp .env.example .env
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   ```

The backend server will start at http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend application will start at http://localhost:3001

## API Documentation

Once the backend server is running, you can access the Swagger API documentation at:
http://localhost:3000/api

## Available Scripts

### Backend

- `npm run start` - Start the application
- `npm run start:dev` - Start the application in watch mode
- `npm run build` - Build the application
- `npm run format` - Format the code
- `npm run lint` - Lint the code
- `npm test` - Run tests

### Frontend

- `npm start` - Start the development server
- `npm run build` - Build the application for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Database Schema

### Shift
- id (UUID)
- title (String, max 100 chars)
- description (String, max 500 chars, optional)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### ShiftDate
- id (UUID)
- date (Date)
- startTime (Time)
- endTime (Time)
- price (Decimal)
- type (Enum: Consultation, Telephone, Ambulance)
- shiftId (UUID, foreign key)

## API Endpoints

### Shifts

- `GET /shifts` - Get all shifts
- `GET /shifts/:id` - Get a specific shift
- `POST /shifts` - Create a new shift
- `PATCH /shifts/:id` - Update a shift
- `DELETE /shifts/:id` - Delete a shift
- `GET /shifts/price-range` - Get min and max prices

## Technologies Used

### Backend
- NestJS
- TypeORM
- PostgreSQL
- Swagger
- Class Validator
- Class Transformer

### Frontend
- React
- TypeScript
- Material-UI
- Redux Toolkit
- React Redux
- Date-fns
- Axios

## Screen Recording

To record your screen while working on this project:

1. Windows: Use the built-in Xbox Game Bar (Win + G)
2. macOS: Use QuickTime Player
3. Linux: Use SimpleScreenRecorder or OBS Studio

## Development Notes

1. The backend follows SOLID principles and clean architecture
2. The frontend uses modern React practices with hooks and TypeScript
3. All forms include validation according to requirements
4. The UI is responsive and follows Material Design guidelines
5. The code is well-documented and follows best practices 