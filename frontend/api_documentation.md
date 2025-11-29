# Event Hub API Documentation

Base URL: `http://127.0.0.1:8000/api`

## Authentication

### Student Signup
- **Endpoint**: `POST /auth/signup/student`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "qid": "Q123456",
    "email": "john@example.com",
    "programme": "BTech",
    "course": "CSE",
    "section": "A",
    "specialization": "AIML",
    "password": "password123",
    "password_confirmation": "password123"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "message": "Student registered successfully",
    "token": "..."
  }
  ```

### Club Signup
- **Endpoint**: `POST /auth/signup/club`
- **Body**:
  ```json
  {
    "club_name": "Coding Club",
    "club_code": "CC01",
    "email": "coding@college.edu",
    "faculty_incharge": "Dr. Smith",
    "password": "password123"
  }
  ```

### Teacher Signup
- **Endpoint**: `POST /auth/signup/teacher`
- **Body**:
  ```json
  {
    "name": "Prof. Johnson",
    "teacher_id": "T987",
    "email": "johnson@college.edu",
    "department": "CSE",
    "password": "password123"
  }
  ```

### Login
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "role": "student" // or 'club', 'teacher'
    }
  }
  ```

## Clubs

### Get All Clubs
- **Endpoint**: `GET /clubs`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "club_name": "Coding Club",
      "club_code": "CC01",
      "faculty_incharge": "Dr. Smith"
    }
  ]
  ```

### Subscribe to Club
- **Endpoint**: `POST /clubs/subscribe`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "club_id": 1
  }
  ```

### Get Club Details
- **Endpoint**: `GET /clubs/{id}`

## Events

### Create Event (Club Only)
- **Endpoint**: `POST /events/create`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Hackathon 2024",
    "description": "Annual coding competition",
    "venue": "Auditorium",
    "start_time": "2024-12-01 10:00:00",
    "end_time": "2024-12-01 18:00:00"
  }
  ```

### Get Club Events
- **Endpoint**: `GET /events/club/{club_id}`

## Attendance

### Get Live QR Data (Club Only)
- **Endpoint**: `GET /attendance/qr/{event_id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "event_id": 1,
    "token": "unique_15s_token_xyz",
    "expires_in": 15
  }
  ```

### Mark Attendance (Student Only)
- **Endpoint**: `POST /attendance/mark`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "event_id": 1,
    "token": "unique_15s_token_xyz"
  }
  ```

### Get Live Attendance List (Club Only)
- **Endpoint**: `GET /attendance/live/{event_id}`
