# RentNest Frontend 🏠

A complete frontend implementation for the RentNest rental marketplace assignment using Next.js App Router, TypeScript, Tailwind CSS, Lucide icons, and Sonner.

## Features

### Public
- Responsive home page
- Property grid
- Search and advanced filters
- Property details/gallery
- Request-to-rent modal
- Loading, error, and 404 states

### Tenant
- Registration/login
- Role selection
- Protected tenant dashboard
- Rental request history
- Approved request → payment flow
- Payment success/cancel pages
- Payment history
- Review CTA placeholder

### Landlord
- Protected dashboard
- Property CRUD UI
- Image URL upload UI
- Availability toggle
- Incoming rental requests
- Optimistic approve/reject updates
- Toast notifications

### Admin
- Protected dashboard
- User search
- Ban/unban
- Platform overview cards
- Moderation-ready structure

## Expected backend

Set:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

The frontend expects these endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `GET /properties`
- `GET /properties/:id`
- `GET /categories`
- `POST /rentals`
- `GET /rentals`
- `POST /payments/create`
- `GET /payments`
- `GET /landlord/properties`
- `GET /landlord/properties/:id`
- `POST /landlord/properties`
- `PATCH /landlord/properties/:id`
- `GET /landlord/requests`
- `PATCH /landlord/requests/:id`
- `GET /admin/users`
- `PATCH /admin/users/:id`

## Run

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Important auth note

Because this is a frontend-only assignment, the login response is expected to contain:

```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "Jane",
      "email": "jane@example.com",
      "role": "TENANT",
      "status": "ACTIVE"
    }
  }
}
```

The token is stored in localStorage for API requests and in a regular cookie so Next.js middleware can protect dashboard routes.

For production, move authentication to secure HttpOnly cookies/server-side session handling.
