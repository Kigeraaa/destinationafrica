# Destination Africa MVP

A full-stack MVP foundation for DestinationAfrica.com, a travel marketplace and SaaS platform connecting travelers with African tour operators.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, JWT, RBAC
- Database: PostgreSQL, SQLite fallback for quick local testing
- Docker: frontend, backend and PostgreSQL services

## What is included

- Logo and brand system
- Traveler, Operator and Admin registration/login flows
- Traveler dashboard with bookings, payments, wishlist, messages, reviews and notifications
- Operator dashboard with tours, bookings, earnings, reviews, withdrawals and messages
- Admin dashboard with users, operators, bookings, GMV, commissions, payments and support tickets
- Marketplace listings showing provider/operator, country, destination, category, price, duration, ratings and chat CTA
- Tour details with itinerary, operator profile, booking CTA and mock payment
- In-app messaging API and seeded demo conversations
- All African countries seeded
- Popular destinations seeded under major tourism countries
- 100 tours and experiences seeded
- 50 travel guides seeded
- Mock payments for Stripe, PayPal, Flutterwave and M-Pesa
- Commission split calculation, operator earnings and transaction logs
- Swagger/OpenAPI docs

## Demo Credentials

Admin
- Email: admin@destinationafrica.com
- Password: Admin123!

Operator
- Email: operator@destinationafrica.com
- Password: Operator123!

Traveler
- Email: traveler@destinationafrica.com
- Password: Traveler123!

## Run with Docker

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up --build
```

Then seed the database:

```bash
docker compose exec backend python -m app.seed
```

Open:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Run locally without Docker

Backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m app.seed
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## MVP Notes

This is a complete buildable foundation for a 1-2 day MVP sprint. It intentionally uses mock payments and image placeholders. For production, replace mock payment flows with live Stripe, Flutterwave and M-Pesa integrations, add cloud media uploads, improve observability, add formal migrations with Alembic and complete QA across browsers/devices.
