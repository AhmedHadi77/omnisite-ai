# Deployment Guide

OmniSite AI keeps local development on SQLite and production on PostgreSQL.

## Production database

Use one of these hosted PostgreSQL providers:

- Neon
- Supabase
- Vercel Postgres
- Railway PostgreSQL

Create a database, then copy the pooled PostgreSQL connection string into `DATABASE_URL`.

Example:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/omnisite_ai?sslmode=require"
```

## Production environment variables

Set these in Vercel Project Settings -> Environment Variables:

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

The app still works without platform API keys for a portfolio demo. Credential tests return a local readiness message when metadata exists and live keys are not configured.

## Prepare the production database

Run this once after `DATABASE_URL` points to PostgreSQL:

```bash
npm run db:push:prod
npm run db:seed:prod
```

`db:push:prod` creates the PostgreSQL tables from `prisma/schema.postgres.prisma`.
`db:seed:prod` adds demo workspace data for the portfolio walkthrough.

## Deploy to Vercel

The repo includes `vercel.json`.

Vercel will run:

```bash
npm install
npm run build:prod
```

The production build generates Prisma Client from `prisma/schema.postgres.prisma`, then builds `apps/web`.

After the project is linked to Vercel and environment variables are set, deploy with:

```bash
npm run deploy:vercel
```

## Demo flow after deployment

Use this recording path:

1. Open `/sign-in`.
2. Sign in as the demo agency owner.
3. Add a site from `/connected-sites`.
4. Test credentials from the site card.
5. Run an audit from `/ai-audit`.
6. Review generated tasks from `/tasks`.
7. Review client requests from `/client-requests`.
8. Open `/case-study` to explain the product and architecture.
