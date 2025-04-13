# Shift Management System - Backend

This is the backend service for the Shift Management System built with NestJS.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a PostgreSQL database named 'shift_management'
5. Copy `.env.example` to `.env` and update the database credentials if needed
6. Start the development server:
   ```bash
   npm run start:dev
   ```

The server will start at http://localhost:3000

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
http://localhost:3000/api

## Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start the application in watch mode
- `npm run build` - Build the application
- `npm run format` - Format the code
- `npm run lint` - Lint the code
- `npm test` - Run tests

## API Endpoints

### Shifts

- `GET /shifts` - Get all shifts
- `GET /shifts/:id` - Get a specific shift
- `POST /shifts` - Create a new shift
- `PATCH /shifts/:id` - Update a shift
- `DELETE /shifts/:id` - Delete a shift
- `GET /shifts/price-range` - Get min and max prices

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