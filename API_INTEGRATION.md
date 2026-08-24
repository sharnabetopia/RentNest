# RentNest — API Integration Map

> **Frontend Base URL:** `http://localhost:3000` (Next.js)
> **Backend Base URL:** `http://localhost:5000/api` (Express/Prisma)
> **Auth:** JWT Bearer token stored in `localStorage` + cookies
> **All responses:** `{ data: T, message?: string }` wrapped by `sendResponse()`

---

## 1. Auth Module

| Page | Component | API Client | Method | Endpoint | Role | Req Body | Res Body |
|---|---|---|---|---|---|---|---|
| `/auth/login` | `LoginForm.tsx` | `auth.login()` | POST | `/auth/login` | PUBLIC | `{ email, password }` | `{ accessToken, user }` |
| `/auth/register` | `RegisterForm.tsx` | `auth.register()` | POST | `/auth/register` | PUBLIC | `{ name, email, password, role }` | `{ User }` |
| — | `auth.ts` (helper) | `auth.getMe()` | GET | `/auth/me` | AUTH | — | `{ User }` |

**Business logic:**
- Login returns JWT `accessToken` + user object → saved to localStorage + cookie
- Register creates user with role: `TENANT` | `LANDLORD` | `ADMIN`
- Password hashed with bcrypt before save
- `saveAuth()` (lib/auth.ts) persists token to localStorage AND sets cookie for middleware

---

## 2. Categories Module

| Page | Component | API Client | Method | Endpoint | Role | Req Body | Res Body |
|---|---|---|---|---|---|---|---|
| `/properties`, `/dashboard/landlord/properties/new`, `edit` | `PropertyBrowser.tsx`, `PropertyForm.tsx` | `properties.getCategories()` | GET | `/categories` | PUBLIC | — | `{ Category[] }` |
| Admin DB | — | — | POST | `/categories` | ADMIN | `{ name }` | `{ Category }` |

**Used by:** Property browser filter dropdown, landlord property creation form (auto-selects first category)

---

## 3. Properties Module (Public)

| Page | Component | API Client | Method | Endpoint | Role | Req Query/Body | Res Body |
|---|---|---|---|---|---|---|---|
| `/` (Hero→Properties), `/properties` | `PropertyBrowser.tsx` | `properties.getProperties()` | GET | `/properties` | PUBLIC | Query params: `searchTerm`, `city`, `categoryId`, `minPrice`, `maxPrice` | `{ Property[] }` |
| `/properties/[id]` | `PropertyDetails.tsx` | `properties.getProperty()` | GET | `/properties/:id` | PUBLIC | Path: `id` | `{ Property }` |

**Filter parameters sent to backend:**
```ts
{
  searchTerm?: string;   // matches title, description, address
  city?: string;         // exact city match
  categoryId?: string;   // UUID of category
  minPrice?: number;     // rent >= min
  maxPrice?: number;     // rent <= max
}
```

**Prisma filter logic (backend):**
- `searchTerm` → `title` OR `description` OR `address` contains (case-insensitive via `includes`)
- `city` → exact match on `city` field
- `categoryId` → exact match on `categoryId` foreign key
- `minPrice`/`maxPrice` → `rent.gte` / `rent.lte` comparison

**Response fields:** `id`, `title`, `description`, `address`, `city`, `rent`, `bedrooms`, `bathrooms`, `images[]`, `amenities[]`, `status`, `category`, `landlord`

---

## 4. Rental Requests Module

| Page | Component | API Client | Method | Endpoint | Role | Req Body | Res Body |
|---|---|---|---|---|---|---|---|
| `/properties/[id]` | `PropertyDetails.tsx` | `rentals.createRental()` | POST | `/rentals` | TENANT | `{ propertyId, moveInDate, duration, message? }` | `{ Rental }` |
| `/dashboard/tenant` | `TenantDashboard.tsx` | `rentals.getMyRentals()` | GET | `/rentals` | TENANT | — | `{ Rental[] }` |
| `/dashboard/tenant/requests/[id]/pay`, `review` | `PaymentPage.tsx`, `ReviewForm.tsx` | `rentals.getRentalDetails()` | GET | `/rentals/:id` | TENANT/LANDLORD/ADMIN | Path: `id` | `{ Rental }` |
| `/dashboard/landlord/requests` | `RequestManagement.tsx` | `landlord.getLandlordRequests()` | GET | `/landlord/requests` | LANDLORD | — | `{ Rental[] }` |
| `/dashboard/landlord/requests` | `RequestManagement.tsx` | `landlord.updateLandlordRequest()` | PATCH | `/landlord/requests/:id` | LANDLORD | `{ status: "APPROVED" \| "REJECTED" }` | `{ Rental }` |

**Rental status flow:**
```
PENDING (tenant submits) → APPROVED (landlord accepts) → COMPLETED (payment webhook)
                            ↓
                         REJECTED (landlord declines)
```

**Business logic:**
- Tenant can only request properties that exist and have status `AVAILABLE`
- Landlord sees only requests for their own properties
- `updateLandlordRequestStatus` validates landlord owns the property
- **Note:** No UI button to manually set COMPLETED — webhook sets it after payment success

---

## 5. Landlord Properties Module

| Page | Component | API Client | Method | Endpoint | Role | Req Body | Res Body |
|---|---|---|---|---|---|---|---|
| `/dashboard/landlord` | `LandlordDashboard.tsx` | `landlord.getLandlordProperties()` | GET | `/landlord/properties` | LANDLORD | — | `{ Property[] }` |
| `/dashboard/landlord/properties/new` | `PropertyForm.tsx` | `landlord.createLandlordProperty()` | POST | `/landlord/properties` | LANDLORD | `{ title, description, address, city, rent, bedrooms, bathrooms, categoryId, amenities[], images[], status }` | `{ Property }` |
| `/dashboard/landlord/properties/[id]/edit` | `PropertyForm.tsx` | `landlord.getLandlordProperty()` | GET | `/properties/:id` | LANDLORD | Path: `id` | `{ Property }` |
| `/dashboard/landlord/properties/[id]/edit` | `PropertyForm.tsx` | `landlord.updateLandlordProperty()` | PUT | `/landlord/properties/:id` | LANDLORD | Partial Property payload | `{ Property }` |
| Backend only | — | — | DELETE | `/landlord/properties/:id` | LANDLORD | Path: `id` | `{ Property }` |

**Business logic:**
- Landlord can only CRUD their own properties (validated by JWT `userId`)
- `amenities` and `images` are stored as JSON arrays
- `status` defaults to `AVAILABLE`
- **Frontend missing:** No delete button in `LandlordDashboard.tsx` or `PropertyForm.tsx` — endpoint exists in backend but UI not wired

---

## 6. Payments Module

| Page | Component | API Client | Method | Endpoint | Role | Req Body | Res Body |
|---|---|---|---|---|---|---|---|
| `/dashboard/tenant/requests/[id]/pay` | `PaymentPage.tsx` | `payments.createPayment()` | POST | `/payments/create` | TENANT | `{ rentalRequestId }` | `{ checkoutUrl, sessionId }` |
| `/dashboard/tenant` | `TenantDashboard.tsx` | `payments.getPayments()` | GET | `/payments` | TENANT | — | `{ Payment[] }` |
| Backend only | — | — | GET | `/payments/:id` | TENANT | Path: `id` | `{ Payment }` |
| Webhook | — | — | POST | `/payments/webhook` | PUBLIC | Stripe raw body | — |

**Payment flow:**
1. Frontend calls `POST /payments/create` with rental ID
2. Backend creates Stripe Checkout Session → returns `checkoutUrl`
3. Frontend redirects user to `window.location.href = checkoutUrl`
4. User pays on Stripe → Stripe calls `POST /payments/webhook`
5. Webhook verifies signature, updates Payment status to `PAID`, sets rental status to `COMPLETED`

**Response:** `{ checkoutUrl: string, sessionId: string }`

**Redirect pages:**
- `/payment/success` → shows success icon, links to tenant dashboard
- `/payment/cancel` → shows cancel icon, links to tenant dashboard

---

## 6. Reviews Module

| Page | Component | API Client | Method | Endpoint | Role | Req Body | Res Body |
|---|---|---|---|---|---|---|---|
| `/dashboard/tenant` (modal) | `ReviewModal.tsx` → `ReviewForm.tsx` | `reviews.createReview()` | POST | `/reviews` | TENANT | `{ propertyId, rating, comment? }` | `{ Review }` |

**Business logic:**
- Tenant can only review properties where rental status is `COMPLETED`
- One review per property per tenant (duplicate check)
- Rating: integer 1–5
- Comment: optional string
- Stores `tenantId` and `propertyId` as foreign keys

**Frontend flow:**
1. Tenant dashboard shows "Leave review" button only on COMPLETED rentals
2. Button opens `ReviewModal` (not a page — inline modal overlay)
3. On submit → API call → toast "Review submitted!" → modal closes

---

## 7. Admin Module

| Page | Component | API Client | Method | Endpoint | Role | Req Body | Res Body |
|---|---|---|---|---|---|---|---|
| `/dashboard/admin` | `AdminDashboard.tsx` | `admin.getAdminUsers()` | GET | `/admin/users` | ADMIN | — | `{ User[] }` |
| `/dashboard/admin` | `AdminDashboard.tsx` | `admin.updateAdminUser()` | PATCH | `/admin/users/:id` | ADMIN | `{ status: "ACTIVE" \| "BANNED" }` | `{ User }` |
| `/dashboard/admin` | `AdminDashboard.tsx` | `admin.getAdminProperties()` | GET | `/admin/properties` | ADMIN | — | `{ Property[] }` |
| `/dashboard/admin` | `AdminDashboard.tsx` | `admin.getAdminRentals()` | GET | `/admin/rentals` | ADMIN | — | `{ Rental[] }` |

**Business logic:**
- `updateUserStatus` toggles between `ACTIVE` and `BANNED`
- `getAdminProperties` returns ALL properties across all landlords
- `getAdminRentals` returns ALL rental requests across all tenants/landlords
- **Missing:** Admin stats cards show hardcoded "API" text — should use `getAdminProperties().length` and count pending rentals

---

## 8. Route Protection (Middleware)

| Route Pattern | Protected? | Required Role | Redirect If Unauthorized |
|---|---|---|---|
| `/` | ❌ | PUBLIC | — |
| `/auth/*` | ❌ | PUBLIC | — |
| `/properties/*` | ❌ | PUBLIC | — |
| `/dashboard/tenant` | ✅ | TENANT or ADMIN | → `/dashboard/landlord` |
| `/dashboard/landlord` | ✅ | LANDLORD or ADMIN | → `/dashboard/tenant` |
| `/dashboard/admin` | ✅ | ADMIN only | → `/dashboard/{role}` |

**Implementation:** `frontend/middleware.ts` — checks `rentnest_token` and `rentnest_role` cookies

---

## 9. Component → Page → API Call Chain (Complete)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PUBLIC FLOW                                                             │
├─────────────────────────────────────────────────────────────────────────┤
│  /                              → Hero.tsx (link to /properties)         │
│  /properties           → PropertyBrowser.tsx                             │
│    ├ getCategories()        → GET  /categories                          │
│    └ getProperties()       → GET  /properties?searchTerm=&city=&...     │
│  /properties/[id]      → PropertyDetails.tsx                             │
│    └ getProperty(id)       → GET  /properties/:id                       │
│    ├ createRental()        → POST /rentals        [TENANT]              │
│    └ getProperty(id)       → GET  /properties/:id                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  TENANT FLOW                                                             │
├─────────────────────────────────────────────────────────────────────────┤
│  /dashboard/tenant        → TenantDashboard.tsx                          │
│    ├ getMyRentals()        → GET  /rentals         [TENANT]             │
│    └ getPayments()        → GET  /payments        [TENANT]             │
│  /dashboard/tenant/requests/[id]/pay → PaymentPage.tsx                  │
│    └ createPayment()       → POST /payments/create  [TENANT]            │
│      └ Stripe redirects to /payment/success or /payment/cancel          │
│  /dashboard/tenant/requests/[id]/review → ReviewForm.tsx (modal)        │
│    └ createReview()        → POST /reviews        [TENANT]             │
│      Condition: rental status must be COMPLETED                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  LANDLORD FLOW                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│  /dashboard/landlord        → LandlordDashboard.tsx                      │
│    ├ getLandlordProperties() → GET  /landlord/properties   [LANDLORD]   │
│    └ getLandlordRequests()   → GET  /landlord/requests     [LANDLORD]   │
│  /dashboard/landlord/properties/new → PropertyForm.tsx                   │
│    └ createLandlordProperty() → POST /landlord/properties [LANDLORD]    │
│  /dashboard/landlord/properties/[id]/edit → PropertyForm.tsx             │
│    ├ getLandlordProperty()   → GET  /properties/:id      [LANDLORD]     │
│    └ updateLandlordProperty() → PUT /landlord/properties/:id [LANDLORD] │
│  /dashboard/landlord/requests → RequestManagement.tsx                     │
│    ├ getLandlordRequests()    → GET  /landlord/requests   [LANDLORD]    │
│    └ updateLandlordRequest()  → PATCH /landlord/requests/:id [LANDLORD] │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  ADMIN FLOW                                                              │
├─────────────────────────────────────────────────────────────────────────┤
│  /dashboard/admin        → AdminDashboard.tsx                            │
│    ├ getAdminUsers()        → GET  /admin/users       [ADMIN]           │
│    ├ updateAdminUser()     → PATCH /admin/users/:id    [ADMIN]          │
│    ├ getAdminProperties()   → GET  /admin/properties    [ADMIN]         │
│    └ getAdminRentals()     → GET  /admin/rentals      [ADMIN]           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Auth Middleware (Backend)

**File:** `backend/src/middlewares/auth.ts`

```
auth()              → Validates JWT, attaches user to req.user
auth("TENANT")      → Validates JWT + role must be TENANT
auth("TENANT","LANDLORD","ADMIN") → Validates JWT + role in list
```

**Token extraction:**
- Header: `Authorization: Bearer <token>`
- Cookie: `rentnest_token=<token>` (for SSR/Next.js middleware)

---

## 11. Payment Webhook

```
POST /api/payments/webhook  (no auth — verified by signature)
Body: Stripe raw event JSON

Logic:
  1. Verify Stripe signature with STRIPE_WEBHOOK_SECRET
  2. Event type: "checkout.session.completed"
  3. Find Payment by metadata.rentalRequestId
  4. Set Payment.status = "PAID"
  5. Set RentalRequest.status = "COMPLETED"
  6. Set Property.status = "RENTED"
```

---

## 12. Data Types (Frontend Interface ↔ Backend Prisma)

### User
```ts
{ id: string; name: string; email: string; role: "TENANT"|"LANDLORD"|"ADMIN"; 
  status: "ACTIVE"|"BANNED"; phone?: string|null; image?: string|null }
```

### Property
```ts
{ id: string; title: string; description: string; address: string; city: string;
  rent: number; bedrooms: number; bathrooms: number; status: "AVAILABLE"|"RENTED"|"UNAVAILABLE";
  images: string[]; amenities: string[]; categoryId: string; category: Category;
  landlordId: string; landlord: User; createdAt: string; updatedAt: string }
```

### RentalRequest
```ts
{ id: string; tenantId: string; propertyId: string; property: Property;
  moveInDate: string; duration: number; message?: string;
  status: "PENDING"|"APPROVED"|"REJECTED"|"COMPLETED";
  tenant: User; createdAt: string; updatedAt: string }
```

### Payment
```ts
{ id: string; rentalRequestId: string; amount: number; transactionId?: string;
  provider: "STRIPE"|"SSLCOMMERZ"; status: "PENDING"|"PAID"|"FAILED";
  createdAt: string }
```

### Review
```ts
{ id: string; tenantId: string; propertyId: string; property: Property;
  rating: number; comment?: string; createdAt: string; updatedAt: string }
```

### Category
```ts
{ id: string; name: string }
```

---

## 13. Missing Integrations (Gaps)

| Gap | Impact | Fix Needed |
|---|---|---|
| Admin stats cards show "API" | Dashboard displays placeholder text | Wire `getAdminProperties()` and `getAdminRentals()` to stat values |
| No landlord property delete UI | Endpoint exists (`DELETE /landlord/properties/:id`) but no button | Add delete button in `LandlordDashboard.tsx` |
| No admin content moderation pages | `GET /admin/properties` and `GET /admin/rentals` exist but no UI | Create `/dashboard/admin/properties` and `/dashboard/admin/rentals` pages |
| No tenant property search on home page | Hero links to `/properties` but no quick search | Add search bar on home page Hero |
| `getLandlordProperty()` hits `/properties/:id` not `/landlord/properties/:id` | Works but bypasses landlord ownership check | Consider adding dedicated landlord property detail endpoint |
| No admin dashboard stats from API | Properties/Pending moderation hardcoded to "API" | Fetch real counts from `/admin/properties` and `/admin/rentals` |
| `BETWEEN` date filter not supported | Rental requests have no date range filter | Add `dateFrom`/`dateTo` params if needed |

---

## 14. Error Handling

| Error Type | Backend Response | Frontend Handling |
|---|---|---|
| 401 Unauthorized | `{ message: "Unauthorized" }` | Redirect to `/auth/login` via middleware |
| 403 Forbidden | `{ message: "Forbidden" }` | Redirect to role-appropriate dashboard |
| 404 Not Found | `{ message: "Not Found" }` | Custom `not-found.tsx` page |
| 500 Server Error | `{ message: "..." }` | `error.tsx` with "Try again" button |
| Network Error | Caught in `apiFetch` wrapper | Toast: "Unable to connect to backend API" |
| Validation Error | `{ message: "..." }` | Toast notification on form |

---

## 15. Environment Variables

| Variable | File | Purpose |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | PostgreSQL connection string |
| `JWT_SECRET` | `backend/.env` | JWT signing secret |
| `STRIPE_SECRET_KEY` | `backend/.env` | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | `backend/.env` | Stripe webhook signature verification |
| `NEXT_PUBLIC_API_URL` | `frontend/.env` | Backend API base URL (default: `http://localhost:5000/api`) |
