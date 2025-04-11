# FastM8

## Overview

FastM8 is a Progressive Web App (PWA) designed to help users track their fasting windows and eating periods. It provides real-time notifications and a simple interface to start, stop, and monitor fasts.

## Features

- Track fasting windows with a simple start/stop button.
- View fasting history and analytics.
- Receive push notifications for fasting milestones.
- Progressive Web App (PWA) functionality for offline use.
- Backend API for data storage and processing.

## Tech Stack

### Frontend (FastM8-Frontend)

- React/Vue (TBD)
- Service Workers (for PWA support)
- GitHub Pages

### Backend (FastM8-Backend)

- Node.js with Express.js
- SQLite for lightweight database storage
- Hosted on a Raspberry Pi
- Push Notification support

## Repository Structure

```
fastm8-frontend/  (Vue PWA)
fastm8-backend/   (Node.js API + SQLite)
```

## Getting Started

### Backend Setup

1. Clone the backend repository:
   ```sh
   git clone https://github.com/mattattaq/fastm8-backend.git
   ```
2. Install dependencies:
   ```sh
   cd fastm8-backend
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```

### Frontend Setup

1. Clone the frontend repository:
   ```sh
   git clone https://github.com/mattattaq/fastm8-frontend.git
   ```
2. Install dependencies:
   ```sh
   cd fastm8-frontend
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## API Endpoints

| Method | Endpoint         | Description                                                                       |
| ------ | ---------------- | --------------------------------------------------------------------------------- |
| GET    | `/status`        | Check API status                                                                  |
| POST   | `/api/users`     | Create a new user (requires username, email, password)                            |
| POST   | `/api/login`     | Login user (requires email, password)                                             |
| POST   | `/api/logs`      | Create a new fasting log (requires userId, startTime, isComplete)                 |
| GET    | `/api/open-logs` | Get open fasting logs for a user (requires JWT token, optional startTime/endTime) |
| PUT    | `/api/logs/edit` | Edit multiple fasting logs (requires logIds and edits array)                      |
| DELETE | `/api/logs`      | Delete open fasting logs for a user (requires userId query parameter)             |

### Authentication

All endpoints except `/status` and `/api/users` require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Date Format

For endpoints accepting dates, use either:

- Full ISO format: `YYYY-MM-DDTHH:mm:ss.sssZ` (e.g., "2025-02-01T01:00:00.000Z")
- Date-only format: `YYYY-MM-DD` (e.g., "2025-02-01")

## Roadmap

- [x] Deploy backend to Raspberry Pi.
- [x] Add push notification support.
- [x] Add Users
- [x] Store user fasting history.
- [ ] Add Postman to repo
- [ ] _OPTIONAL_ Add tokenization or solution to not send raw passwords in request. Maybe JWT token, I haven't decided yet.

## Backend Optimizations TODO

### Database & Connection Management

- [ ] Add proper database connection handling and cleanup
- [ ] Implement connection pooling
- [ ] Add database indexes for frequently queried columns
- [ ] Add proper database migrations system

### Error Handling & Logging

- [ ] Implement centralized error handling middleware
- [ ] Create custom error classes
- [ ] Add proper logging using Winston or similar
- [ ] Add more specific error messages

### Code Organization & Structure

- [ ] Split routes into separate files (auth.js, logs.js)
- [ ] Move database queries to service layer
- [ ] Create middleware for common operations
- [ ] Add TypeScript for better type safety

### Security Improvements

- [ ] Add rate limiting
- [ ] Implement input sanitization
- [ ] Configure specific CORS settings
- [ ] Add helmet.js for security headers
- [ ] Add refresh token mechanism
- [ ] Implement token blacklisting for logout
- [ ] Add password reset functionality

### Performance Optimizations

- [ ] Add caching for frequently accessed data
- [ ] Optimize database queries
- [ ] Add compound indexes where needed

### Testing & Documentation

- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add API tests
- [ ] Add API documentation using Swagger/OpenAPI

### Environment & Configuration

- [ ] Move configuration to dedicated config file
- [ ] Add development/production configurations
- [ ] Add environment variable validation

## Contributing

If you'd like to contribute, feel free to open an issue or submit a pull request!

## License

MIT License
