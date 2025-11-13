# 🧭 PROJECT-RULES.md
> **BSWeb SaaS Project – Core Development Rules & Standards**  
> Version 1.0 – 2025-11-11  
> This document defines the unified coding, architectural, and operational rules for all contributors when working on the BSWeb SaaS monorepo using Cursor, ChatGPT, and Payload CMS.

---

## 1️⃣ GENERAL PRINCIPLES
- **Architecture Standard**: Follow the official SaaS architecture defined in `CHECKPOINT_v6.3-extended.txt` and `ARCHITECTURE.md`.
- **Monorepo Layout**: Always preserve structure:
  ```bash
  apps/
    saas/
    standalone/
  packages/
    cms/
    frontend/
    themes/
    shared/
    i18n/
  docs/
  ```
- **Language Rules**:
  - Code, schema, and configs → **English**.
  - Documentation and explanations → **Vietnamese**.
  - UI text → i18n (NEVER hardcode visible text).

- **Commit Convention**:  
  Use the form `type(scope): description`, e.g.  
  `feat(cms): add search index hooks` or `fix(theme): correct animation delay`.

---

## 2️⃣ I18N & LOCALIZATION
- Use shared package `/packages/i18n/` for all localization logic.
- Locale directories: `packages/i18n/locales/{lang}/{namespace}.json`.
- Admin UI uses `admin-*` namespaces; Site UI uses `site-*`; themes have `theme-*` namespaces.
- When adding new UI components, include translation keys and **DO NOT** commit untranslated strings.
- Tạo hoặc cập nhật namespace trước khi render UI mới; nếu thiếu key → build phải fail.
- Fallback locale = site default → system default (`vi`).
- Each user chooses `adminLanguage` for admin interface.

---

## 3️⃣ CODE STYLE & LINTING
- **Language**: TypeScript everywhere.
- **Framework**: Next.js 16 (App Router, React 19, RSC).
- **Linting**: ESLint + Prettier.  
  Ensure consistent spacing, imports, and unused variable rules.
- **Imports**: Use absolute imports from package roots.
- **Naming**:  
  - Collections: PascalCase (`Users.ts`, `SearchIndex.ts`).  
  - Services: camelCase (`applyThemeToSite.ts`).  
  - Hooks: `useXyz.ts`.  
  - React Components: PascalCase.  
- **Commenting**:
  - Use JSDoc-style for functions, especially shared utilities and Payload hooks.
  - Always explain **why**, not just **what**.

---

## 4️⃣ PAYLOAD CMS RULES
- Collections live in `packages/cms/collections/`.
- Each collection must export default Payload config object.
- Hooks logic → `packages/cms/src/hooks` or inside `/services`.
- Do not hardcode tenant or site references.
- For new collections:
  1. Add schema in `/collections/`.
  2. Register in `/collections/index.ts`.
  3. Add migration script (if DB schema changes).
- Use **access controls (RBAC)** as described in `CHECKPOINT_v6.3-extended.txt`.
- Use Payload’s `afterChange`, `afterDelete` hooks for Audit + Search Index updates.
- Endpoint `/api/payload/[...route]` luôn sử dụng `@payloadcms/next/app` + `createRequestHandler({ config, secret })`; không tự viết proxy thủ công.

---

## 5️⃣ NEXT.JS & FRONTEND RULES
- All apps live in `/apps/saas/app/`.
- **Pages** use Server Components; **UI sections** use Client Components.
- **SectionRenderer** dynamically renders sections from CMS JSON.
- Use TailwindCSS + shadcn/ui + Framer Motion for UI.
- Responsive rules: every section must support Desktop/Tablet/Mobile.
- Never hardcode layout inline; use Theme tokens and Tailwind classes.

---

## 6️⃣ SECURITY & PERFORMANCE
- Enforce 2FA for all admin users.
- Validate file upload MIME type + size per site/tenant.
- Apply Rate Limit (per IP, per user) on login, forms, export.
- CSP, CSRF, and Honeypot must remain enabled by default.
- Toàn bộ request đi qua `middleware.ts` để set CSP + security headers và rate-limit `/api/*`.
- Redis TTL default = 300–600s (configurable).
- Use `cacheTag` and `revalidateTag()` for content caching per site/locale.
- Apply `pgBouncer` for PostgreSQL connection pooling.
- Image optimization via `/img/...` (Sharp + CDN).

---

## 7️⃣ AUTOMATION & AI LAYER
- Automation Rules = (trigger / condition / action) collections.  
- Triggers: `onPublish`, `onLeadSubmit`, `onFormSubmit`.
- Actions: `sendEmail`, `webhook`, `createTask`, `aiGenerate`.
- Assistant API (`/api/assistant`) handles content generation, summaries, and queries.  
  Each tenant/site can override provider config (e.g., OpenAI key).

---

## 8️⃣ DEVOPS & CI/CD
- Use **Docker Compose** for local dev.
- CI via GitHub Actions:
  - Lint → Build → Test → Dockerize.
  - Auto-publish metrics to Prometheus `/metrics`.
- Each commit must pass:
  - TypeScript build.
  - ESLint.
  - Unit tests (Jest or Vitest).
- Auto-backup Postgres + S3 (daily cron).

---

## 9️⃣ CURSOR WORKFLOW RULES
- Always include context files in prompt, e.g.:
  ```text
  @docs/PROJECT-RULES.md
  @docs/CHECKPOINT_v6.3-extended.txt
  @packages/cms/collections/Posts.ts
  ```
- When editing code with Cursor:
  - Specify exact file or folder.
  - Include reference docs (CHECKPOINT, SCHEMA-MASTER).
  - Use Vietnamese prompts but ensure code remains in English.
- Cursor edits must be reviewed manually before commit.

---

## 🔟 VERSIONING & MIGRATION
- Maintain `CHANGELOG.md` at repo root.
- Version bump follows SemVer:
  - Patch → bugfix
  - Minor → feature addition
  - Major → breaking change
- Each new phase (e.g., v6.4 → v6.5) must have a `CHECKPOINT_xx.txt` snapshot in `/checkpoint`.

---

✅ **These rules are mandatory for all developers using Cursor or contributing to BSWeb SaaS.**  
Violating these may lead to rejected commits or failed builds.
