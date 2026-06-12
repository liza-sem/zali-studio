# Projects

Client-oriented hub at **[projects.lizasem.com](https://projects.lizasem.com)** — forked from [Feedbase](https://github.com/liza-sem/feedbase).

**One project = one client.** Each hub has three surfaces:

| Surface | Purpose |
|---------|---------|
| **Requests** | Clients submit work with pinned links, files, priority, and deadline |
| **Timeline** | Agency tracks scoped → in progress → review → done |
| **Brand updates** | Polished changelog-style updates for the client |

## URLs

| Surface | URL |
|---------|-----|
| Dashboard | `https://dash.projects.lizasem.com` |
| Client hub | `https://{client-slug}.projects.lizasem.com` |

Set `NEXT_PUBLIC_ROOT_DOMAIN=projects.lizasem.com` in production.

## Features (v0)

- Requests with rich text, **pinned embed/link**, file attachments, priority, deadline buckets
- Agency workflow statuses: Backlog → Scoped → In Progress → Review → Done
- Timeline board with pinned links on cards
- **Done → Brand update** draft when a request is completed
- Shared rich text toolbar (headings, lists, links)

## Stack

Next.js, Supabase, Turborepo, Dokploy/GHCR deploy.

## Database

Run migrations in `supabase/migrations/`, including:

- `20260612140000_studio_requests.sql` — request fields, `source_feedback_id` on changelogs, `request-attachments` storage bucket

## Local dev

```bash
pnpm install
cd apps/web && pnpm dev
```

Use `dash.localhost:3000` for the dashboard and `{slug}.localhost:3000` for client hubs locally.

## First client: CP

Create a project with slug **`cp`** in the dashboard. URLs once live:

| Who | URL |
|-----|-----|
| You + Nali (dashboard) | `https://dash.projects.lizasem.com/cp` |
| CP client hub | `https://cp.projects.lizasem.com` |

If CP was created on `dash.zali.so`, recreate it here after deploy — each domain uses its own database.

- `projects.lizasem.com` → app (marketing / redirect)
- `dash.projects.lizasem.com` → app (dashboard)
- `*.projects.lizasem.com` → app (per-client hubs)
