import type { Prisma } from "@prisma/client";
import {
  demoAuditFindings,
  type AuditFinding,
  type DemoSite,
  type DemoTask,
  type Platform
} from "./demo-data";
import { prisma } from "./prisma";
import { getCurrentSession } from "./session";

const siteInclude = {
  credential: true,
  tasks: {
    orderBy: { createdAt: "desc" }
  },
  audits: {
    orderBy: { createdAt: "desc" },
    take: 1
  }
} satisfies Prisma.ConnectedSiteInclude;

type SiteWithRelations = Prisma.ConnectedSiteGetPayload<{
  include: typeof siteInclude;
}>;

export async function getDashboardData() {
  const session = await getCurrentSession();
  const [workspace, sites, clientRequests] = await Promise.all([
    prisma.workspace.findUnique({
      where: { id: session.workspaceId },
      include: { owner: true }
    }),
    prisma.connectedSite.findMany({
      where: { workspaceId: session.workspaceId },
      include: siteInclude,
      orderBy: { createdAt: "asc" }
    }),
    prisma.clientRequest.findMany({
      where: { workspaceId: session.workspaceId },
      orderBy: { createdAt: "desc" }
    })
  ]);

  const dashboardSites = sites.map(toDemoSite);
  const tasks = sites.flatMap((site) => site.tasks.map((task) => toDemoTask(task, site.platform)));
  const latestAudits = sites.flatMap((site) =>
    site.audits.map((audit) => ({
      area: site.platform,
      title: `${site.siteName} audit summary`,
      recommendation: audit.aiSummary,
      owner: site.ownerName,
      confidence: Math.round((audit.seoScore + audit.uxScore + audit.speedScore) / 3)
    }))
  );

  return {
    workspace: {
      id: workspace?.id ?? session.workspaceId,
      agencyName: workspace?.agencyName ?? session.agencyName,
      ownerName: workspace?.owner.name ?? session.userName,
      email: workspace?.owner.email ?? session.email
    },
    sites: dashboardSites,
    tasks,
    clientRequests: clientRequests.map((request) => ({
      client: workspace?.agencyName ?? "GrowthOps Studio",
      request: request.requestTitle,
      status: humanizeStatus(request.status),
      age: request.ageLabel
    })),
    auditFindings: normalizeFindings(latestAudits),
    integrationHealth: dashboardSites.map((site) => ({
      platform: site.platform,
      status: site.status === "Connected" ? "Connected" : "Review",
      detail: integrationDetail(site.platform)
    }))
  };
}

export async function getSitesForForms() {
  const session = await getCurrentSession();

  return prisma.connectedSite.findMany({
    where: { workspaceId: session.workspaceId },
    select: { id: true, siteName: true, platform: true, domain: true },
    orderBy: { createdAt: "asc" }
  });
}

export function normalizePlatform(platform: string): Platform {
  const value = platform.toLowerCase();
  if (value === "wordpress") return "WordPress";
  if (value === "shopify") return "Shopify";
  return "Webflow";
}

function toDemoSite(site: SiteWithRelations): DemoSite {
  return {
    id: site.id,
    name: site.siteName,
    domain: site.domain,
    platform: normalizePlatform(site.platform),
    status: site.status === "Needs review" ? "Needs review" : site.status === "Syncing" ? "Syncing" : "Connected",
    healthScore: site.healthScore,
    seoScore: site.seoScore,
    uxScore: site.uxScore,
    speedScore: site.speedScore,
    traffic: site.traffic,
    leads: site.leads,
    orders: site.orders,
    lastSync: site.lastSyncLabel,
    owner: site.ownerName,
    image: site.imageUrl,
    authType: site.credential?.authType,
    credentialPreview: site.credential?.tokenPreview,
    credentialStatus: site.credential?.secretStored ? "Credential saved" : "Credential needed",
    connectionTestStatus: site.credential?.lastTestStatus,
    connectionTestMessage: site.credential?.lastTestMessage
  };
}

function toDemoTask(task: SiteWithRelations["tasks"][number], platform: string): DemoTask {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority === "HIGH" ? "High" : task.priority === "LOW" ? "Low" : "Medium",
    platform: normalizePlatform(platform),
    status: task.status === "IN_PROGRESS" ? "In progress" : task.status === "IN_REVIEW" ? "Review" : "Queued",
    due: task.dueLabel,
    impact: task.impact
  };
}

function normalizeFindings(findings: AuditFinding[]) {
  if (findings.length >= 3) return findings;
  return [...findings, ...demoAuditFindings].slice(0, 4);
}

function humanizeStatus(status: string) {
  if (status === "IN_PROGRESS") return "In production";
  if (status === "IN_REVIEW") return "Awaiting approval";
  if (status === "DONE") return "Completed";
  return "AI draft ready";
}

function integrationDetail(platform: Platform) {
  if (platform === "Webflow") return "CMS, forms, pages";
  if (platform === "WordPress") return "Posts, links, authors";
  return "Products, orders, collections";
}
