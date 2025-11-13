# 📁 Full Directory Structure — BSWebSaaS Monorepo

This document provides the complete folder layout of the SaaS Platform project and describes the role of each component.

---

## 🏗 Root Layout

```
BSWebSaaS/
├─ apps/                        # Main applications (Next.js + Payload)
│  ├─ saas/                     # Primary SaaS app with Payload CMS integration
│  └─ standalone/               # Standalone app exported from SaaS
│
├─ packages/                    # Shared modules and reusable packages
│  ├─ cms/                      # Payload CMS collections, services, hooks
│  ├─ frontend/                 # UI kit, SectionRenderer, components
│  ├─ themes/                   # Theme system and default layouts
│  ├─ i18n/                     # Internationalization (i18n) modules
│  └─ shared/                   # Shared utilities, logging, cache, rate limiting
│
├─ docs/                        # Documentation (Checkpoints, Schema, Guides)
├─ scripts/                     # CLI utilities (seed, export, migration)
├─ docker/                      # Docker and Compose setup
├─ .github/                     # GitHub Actions (CI/CD workflows)
├─ .env / .env.local            # Environment configuration
├─ package.json                 # Root package and workspace scripts
├─ pnpm-workspace.yaml          # Workspace definition for monorepo
└─ tsconfig.json                # Root TypeScript configuration with aliases
```

---

## 🚀 apps/saas (Next.js 16 + Payload CMS)

```
apps/saas/
├─ app/
│  ├─ api/                      # API routes (health, forms)
│  ├─ (site)/[siteSlug]/        # Dynamic site pages (SSR rendering)
│  ├─ img/[...path]/route.ts    # Dynamic image transformation
│  ├─ layout.tsx                # Global layout wrapper
│  └─ page.tsx                  # Default landing page
│
├─ lib/
│  ├─ payload.ts                # getPayload() initialization (v3.63+)
│  ├─ routing.ts                # Tenant/Site resolver (multi-tenant routing)
│  └─ i18n.server.ts            # Server-side i18n loader
│
├─ payload.config.ts            # Core Payload configuration
├─ next.config.ts               # Next.js configuration
├─ tsconfig.json                # Local TypeScript settings
└─ .env.local                   # Local environment variables
```

---

## 📦 packages/cms

```
packages/cms/
├─ collections/                 # Payload collections (Users, Sites, Pages, …)
│  ├─ Users.ts
│  ├─ Tenants.ts
│  ├─ Sites.ts
│  ├─ Pages.ts
│  ├─ Posts.ts
│  ├─ Products.ts
│  └─ index.ts                  # Export all collections
│
├─ src/
│  ├─ services/                 # Business logic helpers (audit, searchIndex, …)
│  ├─ hooks/                    # Payload hooks (before/after change, etc.)
│  └─ utils/                    # Shared CMS helpers
│
├─ types/
│  └─ payload-types.ts          # Auto-generated Payload types
│
├─ index.ts                     # Entry point (exports collections, services)
└─ tsconfig.json
```

**Purpose:**  
Manages all schema definitions, access controls, workflows, and automation logic for Payload CMS.

**Structure rationale:**
- **Collections at root**: Public API, easily accessible via `@bsweb/cms/collections`
- **Services in `src/`**: Implementation details, not directly imported by consumers
- **Consistent with other packages**: `i18n`, `frontend`, `shared` also use root-level public APIs

---

## 🎨 packages/frontend

```
packages/frontend/
├─ components/
│  ├─ sections/                # Section components (Hero, ServicesGrid, …)
│  ├─ forms/                   # Dynamic form components
│  └─ layout/                  # Global layout wrappers
│
├─ SectionRenderer.tsx         # Map section keys → Components
├─ hooks/                      # UI hooks (useI18n, useSectionInView, …)
├─ styles/                     # Tailwind CSS setup
└─ index.ts                    # Barrel export
```

**Purpose:**  
Render frontend UI for each tenant using section-based composition.

---

## 🧩 packages/themes

```
packages/themes/
└─ company-industrial/
   ├─ theme.config.ts           # Tokens, colors, spacing, typography
   ├─ locales/                  # Theme-specific i18n files
   ├─ tokens/                   # Design tokens
   └─ index.ts
```

**Purpose:**  
Centralized theme definitions and visual identity system for tenant sites.

---

## 🌐 packages/i18n

```
packages/i18n/
├─ config/                     # i18n setup (supported locales, fallback logic)
├─ locales/                    # Language resources (vi, en, ja, …)
├─ lib/                        # Loaders and formatters
└─ index.ts
```

**Purpose:**  
Manages all internationalization and translation resources for admin and frontend.

---

## 🧭 packages/shared

```
packages/shared/
├─ logger.ts                   # JSON logger (structured)
├─ cache.ts                    # Cache handler (Redis/local)
├─ rateLimit.ts                # Rate limiter utilities
├─ storage.ts                  # S3/local storage utilities
├─ env.ts                      # Environment variables
├─ validation.ts               # Validation utilities
├─ types.ts                    # Shared types
├─ cache/
│  ├─ redisClient.ts           # Redis client initialization
│  ├─ cacheTags.ts             # Cache tags generators
│  ├─ cacheKeys.ts             # Cache key generators
│  └─ index.ts                 # Barrel export
├─ routing/
│  ├─ paths.ts                 # Dynamic routing helpers
│  ├─ resolveSite.ts           # Site resolution logic
│  └─ index.ts                 # Barrel export
├─ assistant/
│  ├─ assistantClient.ts       # Assistant client
│  ├─ config.ts                # Assistant configuration
│  └─ index.ts                 # Barrel export
├─ auth/
│  ├─ getAuthUser.ts           # Auth user utilities
│  └─ index.ts                 # Barrel export
└─ index.ts                    # Barrel export
```

**Purpose:**  
Provides reusable utilities for logging, caching, rate limiting, routing, authentication, assistant, and infrastructure services.

---

## 🧰 scripts/

```
scripts/
├─ seed-demo.ts                # Seed demo tenants/sites
├─ export-site.ts              # Export site as standalone bundle
├─ db-migrate.ts               # Database migration script
└─ i18n-check.ts               # i18n consistency checker
```

---

## 🐳 docker/

```
docker/
├─ Dockerfile.saas             # Docker build for SaaS app
├─ Dockerfile.standalone       # Docker build for standalone site
├─ compose.yml                 # Stack with Postgres + Redis + app
└─ init/01-init.sql            # Postgres initialization script
```

---

## 📚 docs/

Contains all `.md` documentation files including:
- CHECKPOINTs
- SCHEMA-MASTER
- SECURITY
- DEPLOYMENT
- AUTOMATION
- MONITORING
- etc.

---

✅ **This document is generated as a complete overview of the BSWebSaaS monorepo structure.**
