# BSWeb SaaS – Multi-tenant Website SaaS Platform

Multi-tenant SaaS platform built with Next.js 16, Payload CMS 3.63.0, PostgreSQL, and Redis.

## 🚀 Tech Stack

- **Next.js 16.0.1** (App Router, React Server Components, PPR, Turbopack)
- **Payload CMS 3.63.0** (Next-native, KV, Jobs)
- **PostgreSQL 16** (multi-tenant friendly)
- **Redis 7.x** (LRU, tagging for cache invalidation)
- **React 19.0.0** (suspense/streaming, server components)
- **TypeScript** (strict mode)
- **Tailwind CSS** + **shadcn/ui** + **Framer Motion**

## 📁 Monorepo Structure

```
BSWebSaaS/
├─ apps/
│  └─ saas/                    # Main SaaS app (Next.js + Payload)
├─ packages/
│  ├─ cms/                     # Payload collections, services, hooks
│  ├─ frontend/                # UI components, sections, SectionRenderer
│  ├─ i18n/                    # Internationalization (i18n) modules
│  └─ shared/                  # Shared utilities (logger, cache, routing, etc.)
├─ docs/                       # Documentation (Checkpoints, Schema, Guides)
├─ checkpoint/                 # Checkpoint snapshots
└─ docker/                     # Docker and Compose setup
```

## 🎯 Features

### ✅ Implemented

- Multi-tenant architecture (Tenants, Sites, Domains)
- Payload CMS collections (Pages, Posts, Products, Taxonomies, etc.)
- Search Index hooks (automatic indexing on create/update)
- Audit & Logging hooks (audit events on operations)
- Cache Revalidation (Next.js cache tags with automatic invalidation)
- i18n support (Admin + Site locales)
- Theme system (light/dark, primary color palette)
- Page builder with sections (Hero, Services, Projects, etc.)
- Security (rate limiting, CSRF, CSP headers)

### 🧩 In Progress

- Forms & Leads pipeline
- Automation Rules engine
- AI Assistant integration
- Analytics dashboard
- Export Standalone Site

### ⏳ Planned

- Billing / Subscription
- Marketplace / Extensions
- Advanced Analytics
- Monitoring & Alerting

## 🛠️ Getting Started

### Prerequisites

- Node.js ≥ 20.9.0 (LTS recommended)
- pnpm ≥ 9.10.0
- PostgreSQL 16+
- Redis 7.x (optional, for caching)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp env/example.env .env

# Update .env with your database and Redis credentials

# Start development server
pnpm dev
```

### Environment Variables

See `env/example.env` for required environment variables:

- `DATABASE_URI` – PostgreSQL connection string
- `PAYLOAD_SECRET` – Payload CMS secret key
- `REDIS_URL` – Redis connection string (optional)
- `REVALIDATE_SECRET` – Cache revalidation secret (optional, uses PAYLOAD_SECRET if not set)

## 📚 Documentation

- `docs/HANDBOOK.md` – Developer handbook
- `docs/ARCHITECTURE.md` – System architecture
- `docs/SCHEMA-MASTER.md` – Payload collections schema
- `docs/CACHE-STRATEGY.md` – Cache strategy and performance
- `docs/SECURITY.md` – Security guidelines
- `docs/DEPLOYMENT.md` – Deployment guide
- `checkpoint/CHECKPOINT_v6.4-realistic.txt` – Current checkpoint snapshot

## 🔧 Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

## 🐳 Docker

```bash
# Start with Docker Compose
docker-compose up -d

# Stop services
docker-compose down
```

## 📝 License

Private – All rights reserved

## 🤝 Contributing

This is a private project. For contributions, please contact the project maintainer.

## 📧 Contact

For questions or support, please contact the project maintainer.

---

**Version**: v6.4 – 2025-11-11  
**Status**: Development in progress  
**Checkpoint**: See `checkpoint/CHECKPOINT_v6.4-realistic.txt` for current state

