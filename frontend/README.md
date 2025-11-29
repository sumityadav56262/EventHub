# Event Hub Frontend

Centralized Event Management System for College.

## Features
- **Role-based Auth**: Student, Club, Teacher.
- **Student**: Subscribe to clubs, view events, scan QR for attendance.
- **Club**: Create events, generate dynamic QR codes, view live attendance.
- **Teacher**: Dashboard overview.

## Tech Stack
- React (Vite)
- TailwindCSS + ShadCN UI
- React Router v6
- Axios

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` if needed.

3. Run Development Server:
   ```bash
   npm run dev
   ```

## Backend API
Ensure the backend is running at `http://127.0.0.1:8000/api` (or update .env).
See `api_documentation.md` for details.
