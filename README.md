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

| Method | Endpoint   | Description                 |
| ------ | ---------- | --------------------------- |
| GET    | `/status`  | Check API status            |
| POST   | `/start`   | Start a fast _(wip)_        |
| POST   | `/stop`    | Stop a fast _(wip)_         |
| GET    | `/history` | Get fasting history _(wip)_ |

## Roadmap

- [x] Deploy backend to Raspberry Pi.
- [x] Add push notification support.
- [x] Add Users
- [ ] Store user fasting history.
- [ ] Add Postman to repo
- [ ] _OPTIONAL_ Add tokenization or solution to not send raw passwords in request. Maybe JWT token, I haven't decided yet.

## Contributing

If you'd like to contribute, feel free to open an issue or submit a pull request!

## License

MIT License
