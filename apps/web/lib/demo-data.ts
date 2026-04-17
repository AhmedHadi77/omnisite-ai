export type Platform = "Webflow" | "WordPress" | "Shopify";

export type DemoSite = {
  id: string;
  name: string;
  domain: string;
  platform: Platform;
  status: "Connected" | "Needs review" | "Syncing";
  healthScore: number;
  seoScore: number;
  uxScore: number;
  speedScore: number;
  traffic: string;
  leads: number;
  orders: number;
  lastSync: string;
  owner: string;
  image: string;
  authType?: string;
  credentialPreview?: string;
  credentialStatus?: string;
  connectionTestStatus?: string;
  connectionTestMessage?: string;
};

export type DemoTask = {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  platform: Platform;
  status: "Queued" | "In progress" | "Review";
  due: string;
  impact: string;
};

export type AuditFinding = {
  area: string;
  title: string;
  recommendation: string;
  owner: string;
  confidence: number;
};

export const demoSites: DemoSite[] = [
  {
    id: "northstar-studio",
    name: "Northstar Studio",
    domain: "northstar.example",
    platform: "Webflow",
    status: "Connected",
    healthScore: 86,
    seoScore: 84,
    uxScore: 78,
    speedScore: 72,
    traffic: "42.8k",
    leads: 318,
    orders: 0,
    lastSync: "4 min ago",
    owner: "Maya",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    authType: "Personal access token",
    credentialPreview: "wf_...demo",
    credentialStatus: "Credential saved"
  },
  {
    id: "atlas-journal",
    name: "Atlas Journal",
    domain: "blog.atlas.example",
    platform: "WordPress",
    status: "Needs review",
    healthScore: 74,
    seoScore: 69,
    uxScore: 74,
    speedScore: 81,
    traffic: "18.4k",
    leads: 92,
    orders: 0,
    lastSync: "22 min ago",
    owner: "Daniel",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
    authType: "Application password",
    credentialPreview: "app...demo",
    credentialStatus: "Credential saved"
  },
  {
    id: "forge-supply",
    name: "Forge Supply",
    domain: "shop.forge.example",
    platform: "Shopify",
    status: "Connected",
    healthScore: 79,
    seoScore: 77,
    uxScore: 82,
    speedScore: 68,
    traffic: "63.1k",
    leads: 246,
    orders: 1248,
    lastSync: "7 min ago",
    owner: "Ari",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    authType: "Admin API token",
    credentialPreview: "shpat_...demo",
    credentialStatus: "Credential saved"
  }
];

export const dashboardMetrics = [
  { label: "Site health", value: "80%", detail: "+9 points this month", trend: "up" },
  { label: "AI tasks created", value: "27", detail: "14 ready for review", trend: "steady" },
  { label: "Client approvals", value: "11", detail: "3 waiting on feedback", trend: "up" },
  { label: "Hours saved", value: "38", detail: "from audits and drafts", trend: "up" }
];

export const demoTasks: DemoTask[] = [
  {
    title: "Rewrite Webflow hero CTA",
    description: "Replace broad headline with a sharper conversion message and one primary action.",
    priority: "High",
    platform: "Webflow",
    status: "In progress",
    due: "Today",
    impact: "Conversion"
  },
  {
    title: "Optimize Shopify descriptions",
    description: "Improve five product descriptions with clearer benefits and search terms.",
    priority: "Medium",
    platform: "Shopify",
    status: "Queued",
    due: "Tomorrow",
    impact: "Revenue"
  },
  {
    title: "Repair WordPress internal links",
    description: "Update broken links in the top traffic blog posts before the next content push.",
    priority: "High",
    platform: "WordPress",
    status: "Review",
    due: "Friday",
    impact: "SEO"
  }
];

export const demoAuditFindings: AuditFinding[] = [
  {
    area: "SEO",
    title: "Metadata needs intent matching",
    recommendation: "Rewrite page titles around service intent and add concise meta descriptions with platform-specific terms.",
    owner: "Content",
    confidence: 91
  },
  {
    area: "UX",
    title: "Primary action gets diluted",
    recommendation: "Reduce competing CTAs on high traffic pages and keep the next step consistent across the journey.",
    owner: "Design",
    confidence: 88
  },
  {
    area: "Speed",
    title: "Image payload is too heavy",
    recommendation: "Compress oversized hero and product media before the next campaign launch.",
    owner: "Dev",
    confidence: 84
  },
  {
    area: "Content",
    title: "Product copy misses buying objections",
    recommendation: "Add outcome-led bullets, shipping clarity, and comparison language to the top Shopify collection.",
    owner: "Commerce",
    confidence: 86
  }
];

export const clientRequests = [
  { client: "Northstar Studio", request: "Launch new service page", status: "Awaiting approval", age: "2h" },
  { client: "Atlas Journal", request: "Refresh editorial landing page", status: "AI draft ready", age: "5h" },
  { client: "Forge Supply", request: "Improve product collection SEO", status: "In production", age: "1d" }
];

export const integrationHealth = [
  { platform: "Webflow", status: "Connected", detail: "CMS, forms, pages" },
  { platform: "WordPress", status: "Review", detail: "Posts synced, links flagged" },
  { platform: "Shopify", status: "Connected", detail: "Products, orders, collections" }
];
