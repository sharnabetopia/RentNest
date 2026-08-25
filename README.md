# RentNest

RentNest is a full-stack rental marketplace application built with a Next.js frontend and an Express + Prisma + PostgreSQL backend. It supports property browsing, tenant rental requests, landlord property management, payment integration, and admin oversight.

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide icons

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Stripe for payment flows

---

## Project Structure

```bash
RentNest-fullstack/
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   └── vercel.json
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   └── tailwind.config.ts
├── API_INTEGRATION.md
├── README.md
├── Requirements.md
├── Requirements2.md
└── .gitignore
```

---

## Features

- Property listing and browsing
- Detailed property pages
- User authentication and role-based access
- Tenant rental requests
- Landlord request approval/rejection
- Property CRUD for landlords
- Payment processing and payment history
- Review submission for completed rentals
- Admin dashboard for users, properties, and rental data

---

## Roles

The app uses role-based access control:

- ADMIN
- LANDLORD
- TENANT

Routing and protected routes are enforced in both frontend navigation and backend middleware.

---

## Prerequisites

Before running the project, make sure you have installed:

- Node.js 18+
- npm
- PostgreSQL
- Stripe account credentials for payment integration

---

## Environment Setup

### Backend
Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rentnest?schema=public"
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=7d
JWT_ACCESS_REFRESH_EXPIRES_IN=30d
APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
BCRYPT_SALT_ROUNDS=10
```

### Frontend
Create a `.env.local` file inside the `frontend` folder.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Installation

### 1) Install backend dependencies

```bash
cd backend
npm install
```

### 2) Install frontend dependencies

```bash
cd frontend
npm install
```

---

## Database Setup

From the backend folder:

```bash
cd backend
npm run db:generate
npm run db:migrate
```

This generates Prisma client and applies migrations to the PostgreSQL database.

---

## Run the Project

### Start backend

```bash
cd backend
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### Start frontend

```bash
cd frontend
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

---

## Available Scripts

### Backend

```bash
npm run dev
npm run build
npm run db:generate
npm run db:migrate
npm run deploy
```

### Frontend

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## API Integration Notes

This project includes a route map and integration notes in [API_INTEGRATION.md](API_INTEGRATION.md). That document describes the current backend and frontend contract, including auth, properties, landlord actions, payments, and admin routes.

---

## Common Development Notes

- The backend exposes all routes under `/api`.
- The frontend uses a shared fetch helper to call the backend with the correct base URL and auth headers.
- Stripe webhook routes are handled with raw request bodies.
- Protected routes rely on JWT-based role validation.

---

## Deployment

The project is set up for Vercel deployment in the frontend and backend config files. The app can be deployed separately or with platform-specific deployment settings depending on your environment.

---

## License

This project is for educational and portfolio use unless otherwise specified by the project owner.

---

## Useful Links

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API guide: [API_INTEGRATION.md](API_INTEGRATION.md)

If you are working on this project, start with the backend environment setup and then run the frontend to connect the app to the API.
