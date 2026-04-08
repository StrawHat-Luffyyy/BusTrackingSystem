# SmartBus Backend

Node.js + Express backend using Prisma (PostgreSQL adapter) for the SmartBus project.

## Project structure

- `src/app.js`: Express app wiring (middleware, routes, error handling)
- `src/server.js`: server bootstrap + Prisma connect/disconnect
- `src/prismaClient.js`: Prisma client (PostgreSQL adapter)
- `src/controllers/`: request handlers
- `src/routes/`: route definitions
- `src/middlewares/authMiddleware.js`: JWT auth + role authorization
- `prisma/schema.prisma`: Prisma schema (models + enums)
- `docs/swagger.yaml`: Swagger/OpenAPI source (served at `/api-docs`)

## Environment variables

Required:

- `DATABASE_URL`: Postgres connection string
- `JWT_SECRET`: JWT signing secret

Recommended:

- `PORT`: defaults to `5000`
- `NODE_ENV`: `development` | `production` | `test`
- `JWT_EXPIRES_IN`: e.g. `1h`
- `JWT_COOKIE_EXPIRES_IN`: number of days (e.g. `7`)
- `CLIENT_URL`: comma-separated allowed CORS origins (optional)

## API endpoints (high-level)

Base URL prefix: `/api`

### Health

- `GET /health`: basic uptime check

### Auth (`/auth`)

- `POST /auth/signup`
  - Body: `{ name, email, password }`
  - Note: role cannot be set at signup (prevents privilege escalation)
- `POST /auth/login`
  - Body: `{ email, password }`
  - Sets httpOnly cookie `jwt=...` and returns `{ token, data: { user } }`
- `GET /auth/logout`
  - Clears the cookie by setting `jwt=loggedout`

### Trips (`/trips`)

- `GET /trips/locations`
  - Returns a unique sorted list of cities from existing routes
- `GET /trips/search?origin=&destination=&date=`
  - Filters by origin/destination and/or by date window (24h)

### Bookings (`/bookings`) (protected)

All booking endpoints require being logged in (JWT cookie).

- `POST /bookings`
  - Body: `{ tripId, seatNumbers }` (seatNumbers is comma-separated)
  - Prevents double-booking and capacity overflow inside a transaction
- `GET /bookings/my-bookings`
  - Returns bookings for the current user

### Admin (`/admin`) (protected + role-based)

All admin endpoints require:

- **Authentication**: valid JWT cookie (`protect`)
- **Authorization**: role is `ADMIN` or `OPERATOR` (`restrictTo`)

Admin endpoints:

- `POST /admin/routes` → create a new route
- `POST /admin/buses` → create a bus (supports `multipart/form-data` with `photo`)
- `POST /admin/trips` → create a trip

## Authentication flow

1. User logs in via `POST /api/auth/login`
2. Backend signs a JWT with `{ id, role }` and sets it as an httpOnly cookie `jwt`
3. Protected routes use `protect` middleware:
   - Verifies JWT signature
   - Loads user from DB by `id`
   - **Validates role claim matches DB role** (prevents forged/stale role tokens)
4. Admin routes additionally use `restrictTo("ADMIN", "OPERATOR")`

## Testing

This backend uses Jest in ESM mode.

### Run tests

From `SmartBus/Backend`:

```bash
npm test
```

### What’s tested

- **Unit tests**: auth middleware (`protect`, `restrictTo`)
- **Integration-ish tests**: HTTP flows using `supertest` for:
  - login returns cookie/token
  - admin routes return 401/403 for unauthorized users

Note: Prisma is mocked in tests so you can run them without a database.

## Admin functionality test cases

### Feature: Create Route (`POST /api/admin/routes`)

- **What it does**: Creates a `Route` record using `{ origin, destination, routeName?, distanceKm? }`. If `routeName` is missing, it defaults to `"<origin> to <destination>"`.
- **Auth requirements**: logged in + role in `{ ADMIN, OPERATOR }`
- **Happy path**
  - Input: `{ origin: "A", destination: "B", distanceKm: 12.5 }`
  - Expected: `201` with `{ data: { route } }`
- **Edge cases**
  - Missing origin or destination → `400`
  - Non-admin/operator user → `403`
  - Not logged in → `401`

### Feature: Create Bus (`POST /api/admin/buses`)

- **What it does**: Creates a `Bus` record assigned to the current user as `operatorId`; optionally uploads a `photo` and stores `imageUrl`.
- **Auth requirements**: logged in + role in `{ ADMIN, OPERATOR }`
- **Happy path**
  - Input (form-data): `registrationNo`, `totalSeats`, `busType`, optional `photo`
  - Expected: `201` with created bus
- **Edge cases**
  - Missing required fields → `400`
  - `totalSeats` not numeric → should be rejected/validated (recommended)
  - `busType` invalid (not in enum) → Prisma validation error (expect `400/500` depending on handler)

### Feature: Create Trip (`POST /api/admin/trips`)

- **What it does**: Creates a `Trip` record linking `busId` and `routeId` with times and fare.
- **Auth requirements**: logged in + role in `{ ADMIN, OPERATOR }`
- **Happy path**
  - Input: `{ busId, routeId, departureTime, arrivalTime, fare }`
  - Expected: `201` with created trip
- **Edge cases**
  - Missing any required field → `400`
  - `departureTime` in the past → `400`
  - `arrivalTime` before `departureTime` → currently not validated (recommended)

