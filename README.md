# Zali Studio

Client-oriented hub forked from [Feedbase](https://github.com/liza-sem/feedbase).

**One project = one client.** Each hub has three surfaces:

| Surface | Purpose |
|---------|---------|
| **Requests** | Clients submit work with pinned links, files, priority, and deadline |
| **Timeline** | Agency tracks scoped → in progress → review → done |
| **Brand updates** | Polished changelog-style updates for the client |

## Features (v0)

- Requests with rich text, **pinned embed/link**, file attachments, priority, deadline buckets
- Agency workflow statuses: Backlog → Scoped → In Progress → Review → Done
- Timeline board with pinned links on cards
- **Done → Brand update** draft when a request is completed
- Shared rich text toolbar (headings, lists, links)

## Stack

Same as Feedbase: Next.js, Supabase, Turborepo, Dokploy/GHCR deploy.

## Database

Run migrations in `supabase/migrations/`, including:

- `20260612140000_studio_requests.sql` — request fields, `source_feedback_id` on changelogs, `request-attachments` storage bucket

## Local dev

```bash
pnpm install
cd apps/web && pnpm dev
```

## Deploy

Separate Dokploy app + Supabase project recommended (do not share production Zali public hub DB).
