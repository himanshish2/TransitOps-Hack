# TransitOps Backend

## Setup (do this first, ~15 min)

1. Install Postgres locally if you don't have it (or use a free Neon/Supabase instance if you don't want to install anything — faster for a hackathon).
2. `cp .env.example .env` and fill in `DATABASE_URL` with your real Postgres credentials, and set `JWT_SECRET` to any random string.
3. `npm install`
4. `npx prisma migrate dev --name init` — this creates all tables from `prisma/schema.prisma`.
5. `npm run seed` — creates 4 demo users (one per role, password `password123`) plus a demo vehicle (`VAN-05`) and driver (`Alex`).
6. `npm run dev` — starts the server on `http://localhost:4000`.
7. Hit `GET /health` to confirm it's alive.

## Auth flow

- `POST /api/auth/register` — body: `{ email, password, name, role }`. `role` must be one of `FLEET_MANAGER`, `DRIVER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST`.
- `POST /api/auth/login` — body: `{ email, password }` → returns `{ token, user }`.
- Every other route needs header: `Authorization: Bearer <token>`.

## Endpoints at a glance

| Resource | Routes |
|---|---|
| Vehicles | `GET/POST /api/vehicles`, `GET/PUT/DELETE /api/vehicles/:id` |
| Drivers | `GET/POST /api/drivers`, `GET/PUT/DELETE /api/drivers/:id` |
| Trips | `GET/POST /api/trips`, `GET /api/trips/:id`, `POST /api/trips/:id/dispatch`, `POST /api/trips/:id/complete`, `POST /api/trips/:id/cancel` |
| Maintenance | `GET/POST /api/maintenance`, `POST /api/maintenance/:id/close` |
| Fuel logs | `GET/POST /api/fuel-logs` |
| Expenses | `GET/POST /api/expenses` |
| Reports | `GET /api/reports/vehicle-costs`, `GET /api/reports/vehicle-costs/export` (CSV), `GET /api/reports/fleet-utilization` (dashboard KPIs) |

## Trip lifecycle — how the state machine actually works

1. `POST /api/trips` → creates a trip in `DRAFT`. Only checks cargo weight vs. capacity — does **not** lock the vehicle/driver yet.
2. `POST /api/trips/:id/dispatch` → this is where all the real checks happen (vehicle available, driver available + license not expired + not suspended, capacity re-check). On success, trip → `DISPATCHED`, vehicle & driver → `ON_TRIP`, all in one Prisma transaction so it can't half-apply.
3. `POST /api/trips/:id/complete` → body: `{ finalOdometer, fuelConsumed, actualDistance }`. Trip → `COMPLETED`, vehicle & driver → `AVAILABLE`, vehicle odometer updated, optional fuel log auto-created.
4. `POST /api/trips/:id/cancel` → works from `DRAFT` or `DISPATCHED`. If it was `DISPATCHED`, restores vehicle & driver to `AVAILABLE`.

## Maintenance

- `POST /api/maintenance` with `{ vehicleId, description, cost }` → creates an `ACTIVE` log and flips the vehicle to `IN_SHOP` in the same transaction.
- `POST /api/maintenance/:id/close` → flips back to `AVAILABLE` (unless the vehicle was separately marked `RETIRED`, in which case it stays `RETIRED`).

## Testing without a frontend

Use Postman/Thunder Client/Insomnia, or plain curl. Quick smoke test:

```bash
# Login as fleet manager
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fleet@transitops.com","password":"password123"}'

# Use the returned token for everything else
curl http://localhost:4000/api/vehicles \
  -H "Authorization: Bearer <TOKEN>"
```

Import all your routes into a Postman collection early and share it with your teammate doing frontend — that's your API contract.
