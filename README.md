# OmniSite AI

AI-Powered Multi-Platform Website Management Dashboard for agencies and client teams.

## Pitch

OmniSite AI unifies Webflow, WordPress, and Shopify operations into one dashboard for site health, SEO, content requests, AI audits, and client approvals.

## Core modules

- Unified site dashboard for Webflow, WordPress, and Shopify properties.
- AI site auditor for SEO, UX, speed, copy, and conversion recommendations.
- Smart agency task manager generated from audits and client requests.
- Content assistant for page copy, blog drafts, and product descriptions.
- Client portal for requests, approvals, progress tracking, and before/after notes.
- Integration layer with API connectors and mock execution logs where useful.

## First build phases

1. Auth, dashboard UI, manual connected sites, summary cards.
2. AI audit page with generated suggestions and task creation.
3. Webflow, WordPress, and Shopify metadata sync.
4. Client portal with request submission and task tracking.
5. Deployment, case study, architecture diagram, and demo video.

## Getting started

```bash
npm install
npm run db:generate
npm run db:init
npm run db:seed
npm run dev
```

Create `.env` from `.env.example`. The local MVP uses SQLite through Prisma:

```bash
DATABASE_URL="file:./dev.db"
```

`npm run db:init` creates the local SQLite tables and `npm run db:seed` loads the Webflow, WordPress, Shopify, task, audit, and client request records.

## Production deployment

Local development uses SQLite. Production uses PostgreSQL through `prisma/schema.postgres.prisma`.

Create a hosted PostgreSQL database with Neon, Supabase, Vercel Postgres, or Railway, then set:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/omnisite_ai?sslmode=require"
NEXT_PUBLIC_APP_URL="https://your-vercel-domain.vercel.app"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4o-mini"
WEBFLOW_API_TOKEN=""
WORDPRESS_APP_PASSWORD=""
SHOPIFY_SHOP_DOMAIN=""
SHOPIFY_ADMIN_ACCESS_TOKEN=""
```

Prepare the production database:

```bash
npm run db:push:prod
npm run db:seed:prod
```

Deploy with Vercel. The included `vercel.json` runs:

```bash
npm run build:prod
```

Full deployment notes are in `docs/deployment.md`.

## Local auth and integrations

- `/sign-in` creates a simple HTTP-only cookie session for an agency owner and workspace.
- Dashboard, connected sites, AI audit, tasks, and client requests are scoped to the active workspace.
- The Add Site flow collects platform-specific fields for Webflow, WordPress, and Shopify.
- API secrets are not stored raw in this MVP. The app stores credential metadata, connection labels, scopes, and masked token previews.
- AI audit generation uses the OpenAI Responses API when `OPENAI_API_KEY` is configured, then falls back to local rule-based generation for demos without a key.
- Connection test buttons use environment tokens where required: `WEBFLOW_API_TOKEN`, `WORDPRESS_APP_PASSWORD`, `SHOPIFY_SHOP_DOMAIN`, and `SHOPIFY_ADMIN_ACCESS_TOKEN`.
