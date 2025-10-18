TEST REPORT
===========

Overview
--------
This project contains both backend and frontend automated tests.

- Backend: Jest + Supertest + mongodb-memory-server for integration tests. Tests live in `backend/__tests__`.
- Frontend: Jest + React Testing Library. Tests live in `frontend/src/__tests__`.

How to run tests locally
------------------------
Prerequisites
- Node 18+ (the project uses modern node runtime). Ensure npm is available.
- No external DB required for backend tests (they use in-memory Mongo).

Backend

1. Change to the backend folder:

```bash
cd backend
```

2. Install dev dependencies (if you haven't already):

```bash
npm install
```

3. Run the backend tests (runs Jest with coverage):

```bash
npm test
```

Frontend

1. Change to the frontend folder:

```bash
cd frontend
```

2. Install dependencies (if you haven't already):

```bash
npm install
```

3. Run the frontend tests (CI-friendly run):

```bash
CI=true npm test -- --runInBand --testPathPattern=src/__tests__
```

What the tests cover
--------------------
Backend tests (location: `backend/__tests__`)
- `integration.test.js` — integration tests for the Orders API: creating an order (pending status expected for COD) and updating order status (requires auth). Uses an in-memory MongoDB instance so tests are isolated.
- `auth.integration.test.js` — register & login flows and protected-route checks (ensures role restrictions are enforced).
- Controller unit tests (mocked models) — product, order, user/agent controllers are covered for happy paths and edge cases (e.g., not-found returns 404).

Frontend tests (location: `frontend/src/__tests__`)
- `CartContext.test.js` — unit-like tests for the cart context's `placeOrder`:
  - When createOrderApi succeeds and updateOrderStatusApi is called, placeOrder returns a summary with status 'paid'.
  - When createOrderApi fails, the code falls back to localStorage and returns a pending order summary.
- `AdminDashboard.test.js` — UI test covering order details expansion (Details button) and that updating an order's status triggers the update API.
- `DeliveryDashboard.test.js` — UI test for the delivery agent flows: showing unassigned shipments and successfully claiming an order.
- `AdminConfirmPayment.test.js` — tests updating order status in Admin (mark delivered via the select) and verifying API calls and UI update.
- `DeliveryStatusTransitions.test.js` — tests the full delivery lifecycle from claim to shipped → picked_up → out_for_delivery → delivered and that the UI updates accordingly.
- `CartPageFlow.test.js` — tests the Cart payment modal flow: adding an item to cart, opening the payment modal, simulating payment (mocked APIs), and verifying redirect to `/order-confirmation`.

Notes and troubleshooting
-------------------------
- If tests fail due to missing dev dependencies, run `npm install` in the respective folder (`backend` or `frontend`).
- Backend integration tests use `mongodb-memory-server`; if you see memory-server-related errors, delete `node_modules` and reinstall or increase system resources.
- Frontend tests use React Testing Library and rely on mocking `frontend/src/mockApi.js`. Do not make the tests import external network resources.

CI
--
- There is a GitHub Actions workflow in `.github/workflows/ci.yml`. I recommend ensuring it installs dev dependencies in both `backend` and `frontend` and runs `npm test` in each folder (backend `npm test`, frontend `CI=true npm test -- --runInBand --testPathPattern=src/__tests__`).

Contact
-------
If you want, I can:
- Update the CI workflow to explicitly run both backend and frontend tests.
- Expand test coverage further (more controller unit tests or more UI flows).
