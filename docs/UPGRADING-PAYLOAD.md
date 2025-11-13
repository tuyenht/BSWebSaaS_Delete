# Upgrading Payload CMS in this monorepo

This document describes **how to safely upgrade Payload CMS** (and its related packages)
in the SaaS monorepo.

> Goal: be able to run **one command** to pull in new improvements from Payload  
> while keeping the SaaS project stable and production-ready.

---

## 1. Where Payload lives in this repo

- **Core Payload code** (do NOT touch manually):
  - `node_modules/payload`
  - `node_modules/@payloadcms/next`
  - `node_modules/@payloadcms/db-postgres`
  - `node_modules/@payloadcms/richtext-lexical`

- **Project-specific config & schema** (this repo owns this):
  - `packages/cms/payload.config.ts`
  - `packages/cms/collections/*.ts`
  - `packages/cms/globals/*.ts` (if any)
  - `packages/cms/payload-types.ts` (generated)
  - `packages/cms/**` (searchIndex, audit, automation, export, metrics, ...)

- **Data storage**:
  - PostgreSQL (all collections: users, tenants, sites, pages, posts, products, leads, ...).
  - Storage (local or S3-compatible) for media uploads.
  - Redis for cache / rate-limit (not owned by Payload, used by the app).

Payload acts as the **CMS + Admin + API layer**, while the **actual data** is in Postgres & storage.

---

## 2. Versioning rules

- **Lock Payload version** (no `^` in production):

  ```jsonc
  {
    "dependencies": {
      "payload": "3.63.0",
      "@payloadcms/next": "3.63.0",
      "@payloadcms/db-postgres": "3.63.0",
      "@payloadcms/richtext-lexical": "3.63.0"
    }
  }
  ```

- Upgrade types:
  - **Patch / minor** within same major (e.g. `3.63.0 → 3.70.0`):
    - OK with normal testing.
  - **Major** (e.g. `3.x → 4.x`):
    - Always use a feature branch + staging DB.

---

## 3. One-command upgrade: `pnpm payload:upgrade`

At the root `package.json`, we have:

```jsonc
{
  "scripts": {
    "payload:generate:types": "payload generate:types --config packages/cms/payload.config.ts",
    "payload:upgrade": "pnpm -r up payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical --latest && pnpm payload:generate:types"
  }
}
```

### What this does

1. `pnpm -r up ... --latest`  
   Updates Payload & related packages to the **latest version within the same major**
   across the monorepo.

2. `pnpm payload:generate:types`  
   Regenerates `packages/cms/payload-types.ts` to match the new Payload version.

> **We never copy files from Payload into this repo.**  
> All upgrades go through the package manager + type generation.

---

## 4. Standard upgrade workflow

### 4.1. For minor / patch upgrades (3.x → newer 3.x)

1. **Create a feature branch**:

   ```bash
   git checkout -b chore/upgrade-payload-3-x
   ```

2. **Run the upgrade command**:

   ```bash
   pnpm payload:upgrade
   ```

3. **Run tests & build**:

   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```

4. Fix any TypeScript errors:
   - Focus on `packages/cms/**`:
     - `payload.config.ts`
     - `collections/*.ts`
     - hooks (`beforeChange`, `afterChange`, `access`, ...)
     - integration helpers using `localAPI` / `getPayloadClient`.

5. When everything is green:

   ```bash
   git commit -am "chore: upgrade payload to latest 3.x"
   git push
   ```

   → open PR, get code review, merge.

---

### 4.2. For major upgrades (e.g. 3.x → 4.x)

1. **Create a feature branch**:

   ```bash
   git checkout -b chore/upgrade-payload-v4
   ```

2. **Read the official Payload release notes**:
   - Look for:
     - Breaking changes in config.
     - Changes in `@payloadcms/next`.
     - Auth / hooks / localization changes.

3. **Update version constraints** in `package.json`:

   ```jsonc
   {
     "dependencies": {
       "payload": "4.0.0",
       "@payloadcms/next": "4.0.0",
       "@payloadcms/db-postgres": "4.0.0",
       "@payloadcms/richtext-lexical": "4.0.0"
     }
   }
   ```

4. **Install & generate types**:

   ```bash
   pnpm install
   pnpm payload:generate:types
   ```

5. **Fix compile errors**:
   - TypeScript will highlight all places where the Payload API changed.
   - Focus on:
     - `payload.config.ts`
     - `collections/**`
     - `globals/**`
     - `automation`, `export`, `searchIndex`, etc, if they call `payload.*` directly.

6. **Run DB migrations** on staging DB (not production!):

   ```bash
   # If using Payload migrations:
   pnpm payload:migrate   # or the defined migration script
   ```

7. **Smoke test** on staging:
   - Admin login.
   - Create/edit/publish Pages/Posts.
   - Form submit → Leads.
   - Export site.
   - Automation Rules & Billing (if enabled).

8. When stable → merge branch, then schedule production rollout.

---

## 5. Checklist before merging a Payload upgrade

- [ ] `pnpm payload:upgrade` (or manual version bump + `payload:generate:types`) has been run.
- [ ] `pnpm lint` passes.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.
- [ ] Admin UI verified:
  - [ ] Login, CRUD, publish.
  - [ ] Multi-tenant & domain routing.
  - [ ] i18n (Admin & Site).
- [ ] Critical flows tested on staging:
  - [ ] Forms & Leads.
  - [ ] Export & Backup.
  - [ ] Automation Rules (at least one rule runs successfully).
- [ ] Changelog of Payload has been reviewed and any required code changes applied.

Once all boxes are checked, the upgrade is considered safe to deploy.
