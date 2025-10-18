WHITE-BOX TEST REPORT
=====================


Commands executed (exact)
-------------------------
Backend (Jest + Supertest + mongodb-memory-server):

  cd backend
  npx jest --runInBand --coverage

Frontend (React Testing Library):

  cd frontend
  CI=true npm test -- --coverage --runInBand --testPathPattern=src/__tests__

These are the exact commands I executed inside the workspace to produce the results below.

Backend test results
--------------------
Location: backend/__tests__

- Test suites executed: 4
- Test suites passed: 4
- Total tests: 10
- Tests passed: 10
- Time: ~3.5s (local run)

Key tests included:
- `integration.test.js` — Orders API (create order, update status) — uses an in-memory MongoDB instance.
- `auth.integration.test.js` — Register / Login flows and role-protected endpoint checks.
- `controllers.test.js` — Unit tests for controllers with mocked models.
- `*.test.js` — Product controller unit tests (mocked Product model).

Backend coverage summary (from Jest coverage output):
- All files (statements): 70.81%
- Branch: 46%
- Functions: 69.56%
- Lines: 73.30%

Notable file coverage highlights / gaps:
- `backend/controllers` overall ~56.9% statements. Areas to add tests:
  - `productController.js` low coverage (only some paths mocked). Add unit tests for create/delete flows and error handling.
  - `orderController.js` has untested branches (assignOrder edge cases, error handling).
- `backend/model` files are well covered (models themselves are simple).

Frontend test results
---------------------
Location: frontend/src/__tests__

- Test suites executed: 6
- Test suites passed: 6
- Total tests: 7
- Tests passed: 7
- Time: ~2.8s (local run)

Frontend tests added and executed:
- `CartContext.test.js` — Tests `placeOrder` happy path and fallback behavior (mocked `createOrderApi` / `updateOrderStatusApi`).
- `AdminDashboard.test.js` — Tests order expansion (Details) and status update triggers API.
- `AdminConfirmPayment.test.js` — Tests status update to delivered (simulates admin marking delivered via select).
- `DeliveryDashboard.test.js` — Tests unassigned shipments and claim flow.
- `DeliveryStatusTransitions.test.js` — Tests claim + lifecycle transitions (shipped → picked_up → out_for_delivery → delivered).
- `CartPageFlow.test.js` — Tests payment modal flow and redirect to `/order-confirmation` (seeds cart via context helper and mocks APIs).

Frontend coverage summary (from react-scripts coverage output):
- All files (statements): 30.11%
- Branch: 28.84%
- Functions: 28.07%
- Lines: 29.75%

Notable file coverage highlights / gaps:
- `src/context/CartContext.js` — ~74% statements (good coverage).
- `src/pages/CartPage.js` — ~80% (payment modal flows covered).
- `src/pages/DeliveryDashboard.js` — ~83% (delivery flows covered).
- Many UI pages have 0% coverage because they contain large code paths not yet tested: e.g., `OrderConfirmation.js`, `AdminLogin.js`, `Register.js`, `Profile.js`, `ShopDashboard.js` and several others.
- Overall frontend coverage is intentionally low because the test additions focused on critical flows (checkout, admin orders, delivery). To reach a higher project-wide coverage we should add targeted unit/RTL tests for: Navbar, ProductCard, ShopDashboard, OrderConfirmation rendering and edge cases, and other page logic.

Files with notable uncovered lines (examples)
- `frontend/src/pages/AdminDashboard.js` — many UI branches and controls remain untested (filtering, product CRUD paths, CSV export flows, agent assignment server-backed flows).
- `frontend/src/mockApi.js` — many network code paths are untested because tests mock the exported functions rather than exercising network calls.

— End of report
