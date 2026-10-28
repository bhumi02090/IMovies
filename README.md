# IMovies - Movie ticket booking made simple

A MERN-stack app: browse movies, pick a showtime, select seats in real time, and manage your bookings.

**Stack:** React (Vite), React Router, Bootstrap 5, Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt.

## Features
- Register and log in (JWT authentication, passwords hashed with bcrypt)
- Browse and search movies, view details and upcoming showtimes
- Live seat map: booked seats are disabled
- Seat booking with atomic double-booking protection
- View and cancel your bookings (seats are released on cancel)
- Protected routes for booking pages

## Run locally

### 1. Backend
```bash
cd server
npm install
cp .env.example .env      # then edit MONGO_URI and JWT_SECRET
npm run seed              # adds sample movies and shows
npm run dev               # http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

## API
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | - | Create account |
| POST | /api/auth/login | - | Log in, returns JWT |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/movies?search= | - | List movies |
| GET | /api/movies/:id | - | Movie + upcoming shows |
| GET | /api/shows/:id | - | Show with booked seats |
| POST | /api/bookings | Yes | Book seats `{ showId, seats }` |
| GET | /api/bookings/mine | Yes | My bookings |
| PATCH | /api/bookings/:id/cancel | Yes | Cancel a booking |

## Deployment
- **Database:** MongoDB Atlas (free tier), allow access from anywhere (0.0.0.0/0)
- **Backend:** Render. Root directory `server`, build `npm install`, start `npm start`. Env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your frontend URL)
- **Frontend:** Vercel or Netlify. Root directory `client`, build `npm run build`, output `dist`. Env var: `VITE_API_URL` = `https://<your-backend>.onrender.com/api`
- Run `npm run seed` once against the Atlas database (set `MONGO_URI` locally to the Atlas string first).
