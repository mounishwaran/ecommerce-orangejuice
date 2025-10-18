# FreshFlow – Quick-Commerce for Fresh Orange Juices

FreshFlow is a minimal, fast e-commerce web app to browse, order, and track fresh orange juice deliveries.

## Monorepo Structure
- `backend/` – Node.js + Express + MongoDB API
- `frontend/` – React + Vite + Tailwind UI

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router, React Hot Toast
- Backend: Node.js, Express, Mongoose, express-validator, JWT
- Database: MongoDB Atlas
- Hosting: Vercel (frontend), Render (backend)

## Local Development
1) Backend
- Copy `backend/.env.example` to `backend/.env` and fill values
- Run:
```bash
npm install --prefix backend
npm run dev --prefix backend
```
API runs on `http://localhost:5000` by default.

2) Frontend
- Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL=http://localhost:5000`
- Run:
```bash
npm install --prefix frontend
npm run dev --prefix frontend
```
Web app runs on `http://localhost:5173`.

## Core Features
- Product browsing with filters and search
- Cart with localStorage persistence
- Checkout and order creation
- Real-time order tracking (polling every 5s; backend can simulate progress)
- JWT auth (login/signup)
- Admin dashboard: manage products and orders

## API Endpoints
- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/orders` (user)
- `GET /api/orders` (user)
- `GET /api/orders/all` (admin)
- `PUT /api/orders/:id` (admin)

## Deployment
- Frontend: push `frontend/` to GitHub and deploy on Vercel. Set ENV `VITE_API_URL` to the Render backend URL.
- Backend: push `backend/` to GitHub and deploy on Render using `render.yaml`. Set `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`.

## Notes
- To demo real-time tracking without admin actions, backend `.env` may set `SIMULATE_PROGRESS=true`.
- Protect admin by creating a user and manually setting `role=admin` in DB (or extend auth for admin creation).
