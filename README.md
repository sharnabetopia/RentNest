# RentNest Full-Stack

Combined RentNest project: Next.js frontend + Express/Prisma/PostgreSQL backend from the uploaded project.

## Run backend

```bash
cd backend
npm install
cp .env.example .env
# configure PostgreSQL/JWT/Stripe values in .env
npm run db:generate
npm run db:migrate
npm run dev
```

Backend: `http://localhost:5000`

## Run frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend: `http://localhost:3000`

## Registration fix

The uploaded backend's register endpoint is `POST /api/auth/register`, but it returns a user only; login returns `accessToken`. The frontend now matches that behavior and redirects to login after registration.

The uploaded Express app also did not enable CORS. This combined version enables CORS for `http://localhost:3000`.

## API matching

The frontend is matched to the backend's actual routes, including `/auth`, `/properties`, `/categories`, `/rentals`, `/landlord/properties`, `/landlord/requests`, `/payments`, `/reviews`, and `/admin`.

Never commit `.env` files or real secrets.
