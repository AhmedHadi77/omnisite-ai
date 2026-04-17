const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ownerId = "demo-owner";
const workspaceId = "growthops-workspace";

const sites = [
  {
    id: "site-webflow-northstar",
    platform: "Webflow",
    siteName: "Northstar Studio",
    domain: "northstar.example",
    apiStatus: "CONNECTED",
    status: "Connected",
    healthScore: 86,
    seoScore: 84,
    uxScore: 78,
    speedScore: 72,
    traffic: "42.8k",
    leads: 318,
    orders: 0,
    lastSyncLabel: "4 min ago",
    ownerName: "Maya",
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "site-wordpress-atlas",
    platform: "WordPress",
    siteName: "Atlas Journal",
    domain: "blog.atlas.example",
    apiStatus: "NEEDS_ATTENTION",
    status: "Needs review",
    healthScore: 74,
    seoScore: 69,
    uxScore: 74,
    speedScore: 81,
    traffic: "18.4k",
    leads: 92,
    orders: 0,
    lastSyncLabel: "22 min ago",
    ownerName: "Daniel",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "site-shopify-forge",
    platform: "Shopify",
    siteName: "Forge Supply",
    domain: "shop.forge.example",
    apiStatus: "CONNECTED",
    status: "Connected",
    healthScore: 79,
    seoScore: 77,
    uxScore: 82,
    speedScore: 68,
    traffic: "63.1k",
    leads: 246,
    orders: 1248,
    lastSyncLabel: "7 min ago",
    ownerName: "Ari",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80"
  }
];

const tasks = [
  {
    siteId: "site-webflow-northstar",
    title: "Rewrite Webflow hero CTA",
    description: "Replace broad headline with a sharper conversion message and one primary action.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    source: "AI",
    dueLabel: "Today",
    impact: "Conversion"
  },
  {
    siteId: "site-shopify-forge",
    title: "Optimize Shopify descriptions",
    description: "Improve five product descriptions with clearer benefits and search terms.",
    status: "TODO",
    priority: "MEDIUM",
    source: "AI",
    dueLabel: "Tomorrow",
    impact: "Revenue"
  },
  {
    siteId: "site-wordpress-atlas",
    title: "Repair WordPress internal links",
    description: "Update broken links in the top traffic blog posts before the next content push.",
    status: "IN_REVIEW",
    priority: "HIGH",
    source: "AI",
    dueLabel: "Friday",
    impact: "SEO"
  }
];

const credentials = {
  "site-webflow-northstar": {
    provider: "Webflow",
    authType: "Personal access token",
    accountLabel: "Northstar Webflow workspace",
    apiBaseUrl: "https://api.webflow.com/v2",
    externalSiteId: "webflow-site-northstar",
    tokenPreview: "wf_...demo",
    secretStored: true,
    scopes: "sites:read,cms:read,forms:read"
  },
  "site-wordpress-atlas": {
    provider: "WordPress",
    authType: "Application password",
    accountLabel: "Atlas editor account",
    apiBaseUrl: "https://blog.atlas.example/wp-json/wp/v2",
    externalSiteId: "atlas-wp",
    username: "editor@atlas.example",
    tokenPreview: "app...demo",
    secretStored: true,
    scopes: "posts:read,pages:read,media:read"
  },
  "site-shopify-forge": {
    provider: "Shopify",
    authType: "Admin API token",
    accountLabel: "Forge private app",
    apiBaseUrl: "https://shop.forge.example/admin/api/2026-01",
    externalSiteId: "forge-supply",
    shopDomain: "shop.forge.example",
    tokenPreview: "shpat_...demo",
    secretStored: true,
    scopes: "read_products,read_orders,read_content"
  }
};

const clientRequests = [
  {
    requestTitle: "Launch new service page",
    requestBody: "Northstar needs a conversion-focused service page drafted, reviewed, and queued for Webflow launch.",
    status: "IN_REVIEW",
    ageLabel: "2h"
  },
  {
    requestTitle: "Refresh editorial landing page",
    requestBody: "Atlas wants the editorial hub updated with clearer newsletter positioning and better internal links.",
    status: "TODO",
    ageLabel: "5h"
  },
  {
    requestTitle: "Improve product collection SEO",
    requestBody: "Forge Supply needs collection copy and product metadata improved before the next campaign.",
    status: "IN_PROGRESS",
    ageLabel: "1d"
  }
];

async function main() {
  await prisma.task.deleteMany();
  await prisma.audit.deleteMany();
  await prisma.contentSuggestion.deleteMany();
  await prisma.siteCredential.deleteMany();
  await prisma.clientRequest.deleteMany();
  await prisma.connectedSite.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: ownerId,
      name: "Ahmed",
      email: "ahmed@example.com",
      role: "OWNER",
      workspaces: {
        create: {
          id: workspaceId,
          agencyName: "GrowthOps Studio"
        }
      }
    }
  });

  for (const site of sites) {
    await prisma.connectedSite.create({
      data: {
        ...site,
        workspaceId,
        credential: {
          create: credentials[site.id]
        },
        audits: {
          create: {
            seoScore: site.seoScore,
            uxScore: site.uxScore,
            speedScore: site.speedScore,
            aiSummary: `${site.siteName} needs sharper metadata, clearer primary actions, and platform-specific content polish.`
          }
        }
      }
    });
  }

  await prisma.task.createMany({ data: tasks });
  await prisma.clientRequest.createMany({
    data: clientRequests.map((request) => ({ ...request, workspaceId }))
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeded OmniSite AI local database.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
