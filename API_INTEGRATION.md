# RentNest API Integration Guide

This document describes the current API contract used by the RentNest project and how the frontend integrates with the backend.

## 1. Project architecture

The project is split into two main apps:

- Backend: Express + TypeScript + Prisma + PostgreSQL
- Frontend: Next.js + TypeScript

### Runtime defaults

- Backend base URL: http://localhost:5000
- Frontend base URL: http://localhost:3000
- API prefix: /api
- Frontend API client base: NEXT_PUBLIC_API_URL or http://localhost:5000/api

The frontend uses centralized request helpers in `frontend/lib/api`, with a shared fetch wrapper in `frontend/lib/api/client.ts`.

---

## 2. API conventions

### Response format

Most backend responses follow this shape:

```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

The frontend expects this shape through the shared `ApiResponse<T>` type in `frontend/lib/types.ts`.

### Authentication

The backend uses JWT-based auth. When a token exists, the frontend automatically attaches it to requests via the Authorization header:

```http
Authorization: Bearer <token>
```

Frontend token handling is centralized in `frontend/lib/auth.ts` and the shared client in `frontend/lib/api/client.ts`.

### CORS

The backend enables CORS for localhost development and the frontend origin is expected to be http://localhost:3000.

---

## 3. Backend route map

All backend routes are mounted under `/api` in `backend/src/app.ts`.

### Auth

| Method | Route | Purpose |
| --- | --- | --- |
| POST | /api/auth/register | Create a new account |
| POST | /api/auth/login | Login and receive access token |
| GET | /api/auth/me | Get current authenticated user |

Relevant files:

- `backend/src/modules/auth/auth.route.ts`
- `backend/src/modules/auth/auth.controller.ts`
- `backend/src/modules/auth/auth.service.ts`

Frontend wrapper:

- `frontend/lib/api/auth.ts`

Example login payload:

```json
{
  "email": "tenant@example.com",
  "password": "secret123"
}
```

Example registration payload:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "TENANT"
}
```

Note: The project currently returns the created user from the register endpoint, while the login endpoint returns access token data and user details.

---

### Categories

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /api/categories | List categories |
| POST | /api/categories | Create category (admin only) |

Frontend wrapper:

- `frontend/lib/api/properties.ts` (`getCategories`)

---

### Properties

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /api/properties | List properties with optional filters |
| GET | /api/properties/:id | Get a single property |

Optional query filters include:

- searchTerm
- city
- minPrice
- maxPrice
- categoryId

Frontend wrapper:

- `frontend/lib/api/properties.ts`

Example:

```ts
getProperties({ city: "Dhaka", minPrice: 20000, categoryId: "abc123" })
```

---

### Landlord property management

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /api/landlord/properties | Get landlord-owned properties |
| POST | /api/landlord/properties | Create property |
| PUT | /api/landlord/properties/:id | Update property |
| DELETE | /api/landlord/properties/:id | Delete property |

Frontend wrapper:

- `frontend/lib/api/landlord.ts`

These routes are protected by landlord authentication.

---

### Rentals and requests

#### Tenant routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | /api/rentals | Create rental request |
| GET | /api/rentals | Get tenant rental requests |
| GET | /api/rentals/:id | Get rental request details |

#### Landlord routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /api/landlord/requests | Get landlord rental requests |
| PATCH | /api/landlord/requests/:id | Update request status |

Frontend wrappers:

- `frontend/lib/api/rentals.ts`
- `frontend/lib/api/landlord.ts`

Example rental request payload:

```json
{
  "propertyId": "property-uuid",
  "moveInDate": "2026-09-01",
  "duration": 12,
  "message": "I am interested in this property."
}
```

Landlord status updates typically use:

```json
{
  "status": "APPROVED"
}
```

or

```json
{
  "status": "REJECTED"
}
```

---

### Payments

| Method | Route | Purpose |
| --- | --- | --- |
| POST | /api/payments/create | Create payment record/session |
| GET | /api/payments | Get user payment history |
| GET | /api/payments/:id | Get specific payment details |
| POST | /api/payments/webhook | Stripe webhook endpoint |

Frontend wrapper:

- `frontend/lib/api/payments.ts`

This module is intended for payment flows and Stripe integration.

---

### Reviews

| Method | Route | Purpose |
| --- | --- | --- |
| POST | /api/reviews | Create a tenant review |

Frontend wrapper:

- `frontend/lib/api/reviews.ts`

---

### Admin

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /api/admin/users | Get all users |
| PATCH | /api/admin/users/:id | Update user status |
| GET | /api/admin/properties | Get all properties |
| GET | /api/admin/rentals | Get all rentals |

These routes require admin role authorization.

---

## 4. Frontend API integration pattern

The frontend centralizes requests through `apiFetch` in `frontend/lib/api/client.ts`.

### Wrapper pattern

```ts
import { apiFetch } from "./client";

export function login(payload: { email: string; password: string }) {
  return apiFetch<{ success: boolean; data: { accessToken: string; user: User } }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
```

This helper automatically:

- prefixes the request with `NEXT_PUBLIC_API_URL` or `http://localhost:5000/api`
- adds the Authorization header if a token exists
- sets JSON content type when a body is present
- throws a readable error if the backend returns a non-OK status

---

## 5. Authentication flow in the app

Typical flow for the RentNest frontend:

1. User signs up via `/auth/register`
2. User logs in via `/auth/login`
3. Token is stored in client storage/session using the auth helper layer
4. Protected API calls automatically include the bearer token
5. Server validates the token on protected routes

This behavior is implemented through the frontend auth utilities and the backend auth middleware in `backend/src/middlewares/auth.ts`.

---

## 6. Important project-specific notes

- The backend is mounted under `/api` in `backend/src/app.ts`.
- The frontend calls endpoints without repeating the `/api` prefix because `apiFetch` already adds the base path.
- Registration and login responses differ slightly from a typical REST pattern, so frontend code should be written to match the actual backend response contract.
- Webhook endpoints must be handled carefully because Stripe webhooks use raw request bodies.
- Protected routes rely on role-based auth using `auth("TENANT")`, `auth("LANDLORD")`, and `auth("ADMIN")` middleware.

---

## 7. Suggested integration checklist

When integrating or extending the API, verify the following:

- Base URL is correct: `http://localhost:5000/api`
- Request is sent via the shared `apiFetch` helper when possible
- Authorization token is included for protected endpoints
- Response is parsed using the `ApiResponse<T>` contract
- Role and permission rules match the route requirements
- Development and production environment variables are configured correctly

---

## 8. Core files to reference

- Backend app setup: `backend/src/app.ts`
- Shared API client: `frontend/lib/api/client.ts`
- Auth wrapper: `frontend/lib/api/auth.ts`
- Property wrapper: `frontend/lib/api/properties.ts`
- Rental wrapper: `frontend/lib/api/rentals.ts`
- Landlord wrapper: `frontend/lib/api/landlord.ts`
- Payment wrapper: `frontend/lib/api/payments.ts`
- Type definitions: `frontend/lib/types.ts`

This guide should be used as the source of truth for the project’s current backend contract while building or extending frontend API integrations.
