# TransitOps Backend

API contract finalized with frontend — this version matches it exactly.

## Setup

1. Install Postgres (or use a free Neon/Supabase instance).
2. `cp .env.example .env`, fill in `DATABASE_URL` and `JWT_SECRET`.
3. `npm install`
4. `npx prisma migrate dev --name init`
5. `npm run seed` — creates 4 demo users (`password123`), a demo vehicle (`VAN-05`, region `North`), and a demo driver (`Alex`).
6. `npm run dev` → `http://localhost:4000`

## Auth

`POST /api/auth/login` → `{ token, user: { id, name, email, role } }`. Send `Authorization: Bearer <token>` on every other route.

## Status values (strings, not enums — match frontend exactly)

- Vehicle: `Available`, `On Trip`, `In Shop`, `Retired`
- Driver: `Available`, `On Trip`, `Off Duty`, `Suspended`
- Trip: `Draft`, `Dispatched`, `Completed`, `Cancelled`
- Maintenance: `Active`, `Closed`

## Endpoints

| Resource | Routes |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Dashboard | `GET /api/dashboard?vehicleType=&status=&region=` |
| Vehicles | `GET/POST /api/vehicles`, `GET/PUT/DELETE /api/vehicles/:id` |
| Drivers | `GET/POST /api/drivers`, `GET/PUT/DELETE /api/drivers/:id` |
| Trips | `GET/POST /api/trips`, `GET /api/trips/:id`, `POST /api/trips/:id/dispatch`, `POST /api/trips/:id/complete`, `POST /api/trips/:id/cancel` |
| Maintenance | `GET/POST /api/maintenance`, `POST /api/maintenance/:id/close` |
| Fuel logs | `GET/POST /api/fuel-logs` |
| Expenses | `GET/POST /api/expenses` |
| Reports | `GET /api/reports/vehicle-costs`, `GET /api/reports/vehicle-costs/export` (CSV) |

## Vehicle object shape

```json
{
  "id": "",
  "registrationNumber": "",
  "vehicleModel": "",
  "type": "",
  "maxLoadCapacity": 0,
  "odometer": 0,
  "acquisitionCost": 0,
  "status": "Available",
  "region": ""
}
```

## Driver object shape

```json
{
  "id": "",
  "name": "",
  "licenseNumber": "",
  "licenseCategory": "",
  "licenseExpiryDate": "",
  "contactNumber": "",
  "safetyScore": 0,
  "status": "Available"
}
```

## Dashboard response shape

```json
{
  "activeVehicles": 0,
  "availableVehicles": 0,
  "vehiclesInMaintenance": 0,
  "activeTrips": 0,
  "pendingTrips": 0,
  "driversOnDuty": 0,
  "fleetUtilization": 0,
  "vehicleStatusData": [
    { "status": "Available", "count": 0 },
    { "status": "On Trip", "count": 0 },
    { "status": "In Shop", "count": 0 },
    { "status": "Retired", "count": 0 }
  ]
}
```

Filters (`vehicleType`, `status`, `region`) scope the vehicle-derived numbers and any trips tied to those vehicles. `driversOnDuty` stays fleet-wide since drivers aren't tied to a region/vehicle type.

## Error response shape

Every error from this API looks like:

```json
{ "message": "Registration number already exists", "field": "registrationNumber" }
```

`field` is omitted when it doesn't apply to a specific input (e.g. a generic 404 or 401).

## Trip lifecycle

1. `POST /api/trips` → `Draft`. Only checks cargo weight vs. capacity.
2. `POST /api/trips/:id/dispatch` → re-checks vehicle `Available`, driver `Available` + license not expired + not suspended, capacity again. On success: trip → `Dispatched`, vehicle & driver → `On Trip` (one transaction).
3. `POST /api/trips/:id/complete` → body `{ finalOdometer, fuelConsumed, actualDistance }`. Trip → `Completed`, vehicle & driver → `Available`, odometer updated, optional fuel log auto-created.
4. `POST /api/trips/:id/cancel` → works from `Draft` or `Dispatched`. If it was `Dispatched`, restores vehicle & driver to `Available`.

## Maintenance

`POST /api/maintenance` `{ vehicleId, description, cost }` → creates `Active` log, flips vehicle to `In Shop`. `POST /api/maintenance/:id/close` → flips back to `Available` (stays `Retired` if it was retired).

## Testing checklist

- [ ] Duplicate registration number → 409 with `field: "registrationNumber"`
- [ ] Cargo weight > capacity → 422 with `field: "cargoWeight"`
- [ ] Dispatch a vehicle already on a trip → 422
- [ ] Assign an expired-license driver → 422 with `field: "driverId"`
- [ ] Complete a trip → vehicle/driver back to `Available`
- [ ] Cancel a `Dispatched` trip → vehicle/driver restored
- [ ] Maintenance create → vehicle → `In Shop`; close → back to `Available`
- [ ] `GET /api/dashboard` with and without filters returns matching counts
