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
- GitHub Pages / Vercel / Netlify for hosting

### Backend (FastM8-Backend)

- Node.js with Express.js
- SQLite for lightweight database storage
- Hosted on a Raspberry Pi
- Push Notification support

## Repository Structure

```
fastm8-frontend/  (React/Vue PWA)
fastm8-backend/   (Node.js API + SQLite)
```

## Getting Started

### Backend Setup

1. Clone the backend repository:
   ```sh
   git clone https://github.com/your-username/fastm8-backend.git
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
   git clone https://github.com/your-username/fastm8-frontend.git
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

- [ ] Implement fasting timer UI.
- [ ] Add push notification support.
- [ ] Store user fasting history.
- [ ] Improve UI/UX design.
- [ ] Deploy backend to Raspberry Pi.

## Contributing

If you'd like to contribute, feel free to open an issue or submit a pull request!

## License

MIT License
