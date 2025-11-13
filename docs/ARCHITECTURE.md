# SaaS Platform Architecture Overview

## 1. Purpose
This document explains the **core architecture** of the SaaS Website Platform, including the flow of requests, modular boundaries, and performance layers.

---

## 2. High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Client (Browser / API)                       │
│    ┌────────────────────────────────────────────────────────────┐     │
│    │ Public Site (Next.js 16)                                   │     │
│    │  - Server Components / RSC                                 │     │
│    │  - Dynamic routes by tenant/site domain                    │     │
│    └────────────────────────────────────────────────────────────┘     │
│    ┌────────────────────────────────────────────────────────────┐     │
│    │ Admin (Payload CMS Embedded in Next)                       │     │
│    │  - Collections, Auth, RBAC, Workflow                       │     │
│    │  - Exports, Automation, Analytics                          │     │
│    └────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        Application Core (Server)                     │
│  - Next.js API routes (/api/*)                                       │
│  - Payload CMS Node runtime                                          │
│  - Assistant API (AI layer)                                          │
│  - Automation Engine                                                 │
│  - Analytics Tracker (/api/analytics/track)                          │
│  - Export Worker                                                     │
└──────────────────────────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    Infrastructure & Data Services                    │
│  PostgreSQL  – relational content, multi-tenant storage              │
│  Redis        – cache, KV, rate limit, session, metrics buffer       │
│  S3 / Local   – media + export bundles (tenant/site scoped)          │
│  Prometheus   – metrics endpoint (/metrics)                          │
│  Grafana      – dashboard (external integration)                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Module Responsibilities

| Module | Description |
|--------|-------------|
| **Next.js (App Router)** | Hosts Admin + Site frontends with RSC and PPR. |
| **Payload CMS** | Core CMS backend: auth, collections, workflow, RBAC. |
| **Redis Cache Layer** | Stores rate limits, cached queries, analytics buffer. |
| **PostgreSQL** | Primary DB for tenants, sites, content, forms, analytics. |
| **AI Assistant Layer** | GPT-based content generation, SEO, translations. |
| **Automation Engine** | Trigger-based workflow executor (on lead, publish, etc.). |
| **Analytics System** | Tracks metrics, aggregates daily stats per site. |
| **Export Engine** | Builds standalone deployable site bundles. |
| **Monitoring & Metrics** | Prometheus endpoint `/metrics`, Grafana ready. |

---

## 4. Request Lifecycle

### 4.1. Public Site Request Flow

```
Browser → CDN (Cloudflare) → Next.js (Edge/Server)
  → middleware/domainRouter.ts → resolve Site + Tenant
  → Cache lookup (Redis)
  → Fetch content via Payload CMS (via local embed API)
  → Render React Server Component tree (PPR)
  → Send HTML stream
```

### 4.2. Admin Panel Request Flow

```
Admin (Next.js + Payload Admin)
  → Auth middleware (JWT or session)
  → RBAC permission check
  → Serve CMS UI + data via REST/GraphQL
```

### 4.3. API Request Flow

```
Client → /api/... route (Next.js)
  → Auth (if required)
  → Payload local client for DB ops
  → Redis + PostgreSQL + S3 as needed
  → Response JSON
```

---

## 5. Tenant Isolation

Each tenant is identified by a `tenantId` (and their sites by `siteId`).
All queries are automatically scoped by these IDs.

- Storage prefix: `uploads/{tenantId}/{siteId}/...`
- Cache key prefix: `site:{siteId}:{locale}:{collection}`
- Log metadata: `{tenantId, siteId, userId}`

No tenant can read or modify another tenant’s data.

---

## 6. Multi-Language Design

- Admin UI: locale per user (stored in user preferences).
- Site UI: locale resolved from URL or site settings.
- Locale keys are always strings (e.g. "vi", "en", "ja"), no hardcoded enums.
- JSON dictionaries under `/packages/i18n/locales/{lang}/`.

---

## 7. Scalability & Performance Layers

| Layer | Strategy |
|--------|-----------|
| **Frontend** | CDN caching + Next.js PPR + lazy RSC loading |
| **Backend** | Redis KV cache for heavy queries |
| **DB** | Postgres with connection pooling (pgBouncer) |
| **Storage** | S3 with CDN edge caching |
| **Job Queue** | Async via Payload background jobs |
| **Metrics** | Aggregated daily (AnalyticsDailyStats) |
| **AI** | Configurable per site/tenant/provider |

---

## 8. Observability & Health

- `/healthz`: returns `"ok"` with uptime & DB/Redis check.
- `/metrics`: Prometheus metrics (request counts, latency, errors).
- `AuditEvents`: stored in Payload collection (CRUD, export, login, etc.).
- Alert hooks: Discord/Slack webhooks supported.

---

## 9. Deployment

### Environments
- **Local**: Docker Compose with Postgres + Redis.
- **Staging**: Cloud Run + managed Postgres/Redis.
- **Production**: Load-balanced Cloud Run + Cloud Storage or S3.

### Deployment flow
```bash
git push main
→ GitHub Actions CI (lint, build, test)
→ Build Docker image
→ Deploy to Cloud Run (auto)
→ Health check → metrics ready
```

---

## 10. Future Extension

- Billing & Subscription service (Stripe/Paddle)
- Real-time Logs dashboard (Redis streams)
- Full-text Search service (Meilisearch)
- AI-driven analytics insights

---

## 11. Summary

This architecture emphasizes:

- Multi-tenant isolation
- Multi-locale flexibility
- High scalability with low coupling
- Developer autonomy (clear module boundaries)
