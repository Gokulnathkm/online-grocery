# Testing the online-grocery project

This repo contains a frontend (React) and backend (Express + MongoDB). The project is set up with unit and integration tests using Jest and Supertest.

## Run backend tests (integration + unit)

1. Install dependencies and run tests:

```bash
cd backend
npm install
npm test
```

This runs Jest and produces coverage (coverage/).

Integration tests use `mongodb-memory-server` so they run in isolation without a production DB.

## Run frontend tests

```bash
cd frontend
npm install
# runs in interactive watch mode
npm test
# or run once
CI=true npm test -- --coverage --watchAll=false
```

## Run everything (locally)

```bash
# backend tests
cd backend && npm test
# frontend tests
cd ../frontend && CI=true npm test -- --coverage --watchAll=false
```


