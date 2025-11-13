# Export System – SaaS Platform

This document describes the export mechanism that generates standalone deployable sites for each tenant.

---

## 1. Overview

The **Export System** allows a tenant/site to download or deploy an independent static/SSR bundle, including:

- Site content (pages, posts, products).  
- Theme configuration.  
- Media files.  
- Build-ready Next.js standalone app.  

Result: A zip bundle deployable anywhere (Vercel, Cloudflare, Docker).

---

## 2. Goals

- Allow clients to self-host or archive their site.  
- Ensure export parity with SaaS-hosted version.  
- Maintain license and i18n data integrity.  
- Support offline use cases.

---

## 3. Export Flow

```
1. User clicks “Export Site” in Admin.
2. API → /api/sites/[id]/export
3. System gathers site data & theme config.
4. Generate build bundle + JSON data.
5. Zip + store in tenant’s S3 prefix.
6. Notify user via email / notification.
```

---

## 4. Folder Structure of Bundle

```
/export/
 ├─ data/
 │   ├─ pages.json
 │   ├─ posts.json
 │   ├─ products.json
 │   └─ settings.json
 ├─ media/
 │   └─ ... (images, uploads)
 ├─ theme/
 │   ├─ theme.config.json
 │   └─ assets/
 ├─ build/
 │   └─ next-standalone/
 ├─ docker-compose.yml
 ├─ env/
 │   └─ example.env
 └─ README.md
```

---

## 5. Technical Details

- Uses Payload local API to fetch all collections.  
- Generates deterministic JSON structure.  
- Builds with Next.js `--standalone` output.  
- Compresses with ZIP and uploads to S3.  
- Supports incremental export (changed data only).  

---

## 6. Permissions

- Only `saasOwner` or delegated roles can export.  
- `siteOwner` requires explicit grant.  
- Logs every export in `AuditEvents`.  

---

## 7. API Endpoint

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/sites/[id]/export` | Initiate export |
| `GET` | `/api/sites/[id]/export/status` | Check progress |
| `GET` | `/api/sites/[id]/export/download` | Download ZIP |

Response example:

```json
{
  "status": "completed",
  "bundleUrl": "https://s3/.../export-site-2025-11-10.zip"
}
```

---

## 8. Export Worker

Background job in Payload:

```js
payload.jobs.add({
  name: 'site-export',
  data: { siteId, tenantId }
});
```

Supports:
- Progress tracking.  
- Error handling with retries.  
- Automatic cleanup of old bundles.

---

## 9. Notifications

Upon completion, user receives email:

```
Subject: [Your SaaS Platform] Site Export Completed
Body:
Your export for site "An Vinh Engineering" is ready.
Download: https://s3/.../export-abc123.zip
```

---

## 10. Storage & Retention

- Stored under `exports/{tenantId}/{siteId}/...` in S3.  
- Retained for 30 days (configurable).  
- Auto-cleanup via cron job.

---

## 11. Security

- Exported bundles include only public content.  
- No user data, credentials, or API keys.  
- Checksum validated after upload.  
- Access control: Signed download URL (valid 1h).  

---

## 12. Reimport (Optional)

Future feature: Reimport exported bundle → recreate site.

---

## 13. CLI Support

Developers can trigger export via CLI:

```bash
pnpm site:export --site anvinh --tenant t5g
```

Logs to `/logs/export.log`.

---

## 14. Monitoring & Metrics

| Metric | Description |
|---------|-------------|
| `export_jobs_total` | Total exports triggered |
| `export_failures_total` | Failed exports |
| `export_duration_seconds` | Export time duration |

Export dashboard in Grafana visualizes job volume & duration.

---

## 15. Future Enhancements

- Partial exports (collections or locales).  
- Multi-format exports (ZIP, TAR, Docker image).  
- Deploy-to-Vercel / Cloudflare direct integration.  
- Scheduled automatic exports.

---

## 16. Contacts

- **Export Lead:** export@yourdomain.com  
- **Support:** support@yourdomain.com
