# Enterprise SaaS Platform

Scalable web platform for business management featuring a real-time dashboard and advanced analytics. Built with a modern React frontend and a robust Node.js backend.

## Features

- Real-time analytics dashboard
- Role-based access control (RBAC)
- Multi-tenant architecture
- REST + GraphQL API
- Advanced reporting and data export
- Webhook system for third-party integrations
- Audit logs

## Tech Stack

- **React 18** — Frontend framework
- **Node.js + Express** — Backend API
- **PostgreSQL** — Primary database
- **Redis** — Caching and sessions
- **Prisma ORM** — Database toolkit
- **JWT** — Authentication
- **Docker + Docker Compose** — Development and deployment

## Getting Started

```bash
# Clone the repo
git clone https://github.com/totem451/enterprise-saas-platform.git
cd enterprise-saas-platform

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Configure DATABASE_URL and other variables

# Run database migrations
npx prisma migrate dev

# Start development servers
npm run dev
```

## Architecture

```
React SPA
    ↓
Node.js API (Express)
    ↓
PostgreSQL ← Redis (cache)
```

## License

MIT — built by [TL Studio](https://github.com/totem451)
