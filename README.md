# Enterprise CRM Platform

![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.0-000000?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-06B6D4?logo=tailwindcss)

A lightweight, full-stack CRM SaaS platform for managing customers and deals. Built with modern web technologies and zero external database dependencies (SQLite out of the box).

## Features

- **Authentication** — JWT-based login with role-based access control (Admin / Viewer)
- **Dashboard** — Key metrics, pipeline value, deals-by-stage bar chart, recent customers
- **Customers** — Full CRUD with search, status filtering, and pagination
- **Deals** — Kanban board + table view with stage tracking and pipeline calculations
- **Settings** — User profile, role/permissions display

## Screenshots

> _Login page with demo credentials prefilled_

> _Dashboard with metric cards and Recharts bar chart_

> _Customers table with search and status filter_

> _Deals kanban board showing all 6 pipeline stages_

> _Customer detail with inline editing and associated deals_

## Architecture

```
enterprise-saas-platform/
├── backend/                    # Node.js (ESM) + Express 5 + Prisma + SQLite
│   ├── prisma/
│   │   ├── schema.prisma       # User, Customer, Deal models
│   │   └── seed.js             # Demo data (1 admin, 8 customers, 12 deals)
│   └── src/
│       ├── index.js            # Express app entry point
│       ├── config.js           # Environment config
│       ├── db/client.js        # Prisma client singleton
│       ├── middleware/
│       │   ├── auth.js         # JWT verification
│       │   └── rbac.js         # Role-based access control
│       └── routes/
│           ├── auth.js         # POST /auth/login, /auth/register
│           ├── customers.js    # CRUD /customers
│           ├── deals.js        # CRUD /deals
│           └── dashboard.js    # GET /dashboard/metrics
└── frontend/                   # React 18 + Vite + Tailwind CSS v3
    └── src/
        ├── App.jsx             # React Router v6 routes
        ├── api/                # Axios API clients
        ├── store/authStore.js  # Zustand auth state (localStorage persist)
        ├── hooks/useAuth.js    # Auth guards
        ├── components/         # Layout, Sidebar, UI primitives
        └── pages/              # Login, Dashboard, Customers, Deals, Settings
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Clone & Configure

```bash
git clone https://github.com/totem451/enterprise-saas-platform.git
cd enterprise-saas-platform

# Configure backend environment
cp backend/.env.example backend/.env
# Edit backend/.env to set a strong JWT_SECRET for production
```

### 2. Backend Setup

```bash
cd backend
npm install

# Generate Prisma client and create SQLite database
npx prisma migrate dev --name init

# Seed demo data (admin user + 8 customers + 12 deals)
node prisma/seed.js

# Start the API server
npm run dev
# API running on :3001
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Start the dev server
npm run dev
# http://localhost:5173
```

### 4. Open the app

Navigate to **http://localhost:5173** and sign in with the demo credentials below.

## Demo Credentials

| Role   | Email           | Password |
|--------|-----------------|----------|
| Admin  | admin@demo.com  | demo1234 |
| Viewer | viewer@demo.com | demo1234 |

**Admin** can create, edit, and delete records.
**Viewer** has read-only access.

## API Endpoints

### Auth

| Method | Endpoint             | Description              | Auth Required |
|--------|----------------------|--------------------------|---------------|
| POST   | `/api/auth/register` | Register a new user      | No            |
| POST   | `/api/auth/login`    | Login, returns JWT token | No            |
| GET    | `/api/auth/me`       | Get current user info    | Yes           |

### Customers

| Method | Endpoint             | Description                           | Role  |
|--------|----------------------|---------------------------------------|-------|
| GET    | `/api/customers`     | List customers (search, status, page) | Any   |
| GET    | `/api/customers/:id` | Get customer with deals               | Any   |
| POST   | `/api/customers`     | Create customer                       | Admin |
| PUT    | `/api/customers/:id` | Update customer                       | Admin |
| DELETE | `/api/customers/:id` | Delete customer                       | Admin |

Query params: `?search=name&status=ACTIVE&page=1&limit=20`

### Deals

| Method | Endpoint        | Description                           | Role  |
|--------|-----------------|---------------------------------------|-------|
| GET    | `/api/deals`    | List deals (stage, customerId filter) | Any   |
| GET    | `/api/deals/:id`| Get deal detail                       | Any   |
| POST   | `/api/deals`    | Create deal                           | Admin |
| PUT    | `/api/deals/:id`| Update deal                           | Admin |
| DELETE | `/api/deals/:id`| Delete deal                           | Admin |

Query params: `?stage=PROPOSAL&customerId=xxx`

### Dashboard

| Method | Endpoint                 | Description     | Auth Required |
|--------|--------------------------|-----------------|---------------|
| GET    | `/api/dashboard/metrics` | Get CRM metrics | Yes           |

**Response:**
```json
{
  "totalCustomers": 8,
  "activeCustomers": 5,
  "totalDeals": 12,
  "pipeline": 113500.00,
  "wonRevenue": 57800.00,
  "dealsByStage": [
    { "stage": "PROSPECTING", "count": 3, "value": 36000 }
  ],
  "recentCustomers": [...]
}
```

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Backend    | Node.js 18+ (ESM), Express 5  |
| ORM        | Prisma 5 + SQLite             |
| Auth       | JWT (jsonwebtoken + bcryptjs) |
| Frontend   | React 18, Vite 6              |
| Styling    | Tailwind CSS v3               |
| State      | Zustand v5 (persisted)        |
| Data Fetch | TanStack React Query v5       |
| Charts     | Recharts 2                    |
| Icons      | Lucide React                  |
| Routing    | React Router v6               |
| HTTP       | Axios                         |

## Production Notes

- Replace `JWT_SECRET` in `.env` with a strong random secret
- For production, switch to PostgreSQL by updating `schema.prisma` and `DATABASE_URL`
- A `docker-compose.yml` with PostgreSQL is included in the repo root
- Consider adding rate limiting (`express-rate-limit`) and input validation (`zod`) before going live

## License

MIT — built by [TL Studio](https://github.com/totem451)
