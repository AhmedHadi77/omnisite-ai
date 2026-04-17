# Architecture

OmniSite AI is a monorepo with a Next.js frontend, backend integration service, shared packages, and Prisma data model.

## Main flow

1. A workspace owner connects a Webflow, WordPress, or Shopify site.
2. The API integration layer fetches metadata, content records, forms, orders, or page summaries.
3. Synced data is stored as connected sites, audits, content suggestions, tasks, and client requests.
4. The AI service turns site context into audit summaries, content edits, and agency-ready tasks.
5. The frontend presents the unified dashboard and client portal workflows.

## App boundaries

- `apps/web`: Next.js UI, dashboard screens, marketing pages, client portal.
- `apps/api`: Integration endpoints, platform service clients, AI orchestration, middleware.
- `packages/types`: Shared TypeScript contracts.
- `packages/ui`: Shared UI exports.
- `packages/utils`: Shared formatting, scoring, and platform helpers.
- `prisma`: Database schema and migrations.