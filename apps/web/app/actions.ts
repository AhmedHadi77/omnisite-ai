"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { decryptSecret, encryptSecret } from "../lib/crypto";
import { normalizePlatform } from "../lib/dashboard-data";
import type { Platform } from "../lib/demo-data";
import { generateSiteAudit } from "../lib/openai-audit";
import { prisma } from "../lib/prisma";
import { getCurrentSession } from "../lib/session";

type SiteInput = {
  platform: Platform;
  siteName: string;
  domain: string;
  ownerName: string;
  credential: {
    provider: Platform;
    authType: string;
    accountLabel: string;
    apiBaseUrl: string;
    externalSiteId: string;
    username: string;
    shopDomain: string;
    tokenPreview: string;
    encryptedSecret: string;
    encryptionIv: string;
    encryptionTag: string;
    secretStored: boolean;
    scopes: string;
  };
};

export async function addSiteAction(formData: FormData) {
  const session = await getCurrentSession();
  const input = parseSiteForm(formData, session.userName);
  const seed = hashText(`${session.workspaceId}-${input.domain}-${input.platform}`);
  const seoScore = scoreFromSeed(seed, 65, 91);
  const uxScore = scoreFromSeed(seed + 13, 66, 93);
  const speedScore = scoreFromSeed(seed + 29, 62, 90);
  const healthScore = Math.round((seoScore + uxScore + speedScore) / 3);

  await prisma.connectedSite.create({
    data: {
      workspaceId: session.workspaceId,
      platform: input.platform,
      siteName: input.siteName,
      domain: input.domain,
      ownerName: input.ownerName,
      apiStatus: input.credential.secretStored ? "CONNECTED" : "MOCKED",
      status: input.credential.secretStored ? "Connected" : "Needs review",
      healthScore,
      seoScore,
      uxScore,
      speedScore,
      traffic: `${scoreFromSeed(seed + 41, 8, 79)}.${scoreFromSeed(seed + 5, 1, 9)}k`,
      leads: scoreFromSeed(seed + 7, 24, 380),
      orders: input.platform === "Shopify" ? scoreFromSeed(seed + 11, 80, 1400) : 0,
      lastSyncLabel: "Just now",
      imageUrl: imageForPlatform(input.platform),
      credential: {
        create: input.credential
      },
      audits: {
        create: {
          seoScore,
          uxScore,
          speedScore,
          aiSummary: `${input.siteName} was added with ${input.credential.authType}. Run an AI audit to create platform-specific tasks.`
        }
      }
    }
  });

  revalidateAppViews();
  redirect("/connected-sites?added=1");
}

export async function runAiAuditAction(formData: FormData) {
  const session = await getCurrentSession();
  const siteId = String(formData.get("siteId") ?? "");
  if (!siteId) return;

  const site = await prisma.connectedSite.findFirst({
    where: {
      id: siteId,
      workspaceId: session.workspaceId
    },
    include: {
      credential: true
    }
  });

  if (!site) return;

  const audit = await generateSiteAudit(site);

  await prisma.audit.create({
    data: {
      siteId: site.id,
      seoScore: audit.seoScore,
      uxScore: audit.uxScore,
      speedScore: audit.speedScore,
      aiSummary: audit.aiSummary
    }
  });

  await prisma.task.createMany({
    data: audit.tasks.map((task) => ({
      siteId: site.id,
      title: task.title,
      description: task.description,
      status: "TODO",
      priority: task.priority,
      source: "AI",
      dueLabel: task.dueLabel,
      impact: task.impact
    }))
  });

  await prisma.connectedSite.update({
    where: { id: site.id },
    data: {
      apiStatus: site.credential?.secretStored ? "CONNECTED" : "MOCKED",
      status: site.credential?.secretStored ? "Connected" : "Needs review",
      lastSyncLabel: "Just now"
    }
  });

  revalidateAppViews();
  redirect("/tasks?audit=created");
}

export async function testCredentialAction(formData: FormData) {
  const session = await getCurrentSession();
  const domain = cleanDomain(formData.get("domain"));
  const site = await prisma.connectedSite.findFirst({
    where: {
      domain,
      workspaceId: session.workspaceId
    },
    include: {
      credential: true
    }
  });

  if (!site?.credential) {
    redirect("/connected-sites?tested=missing");
  }

  const result = await testPlatformCredential(site.platform, site.credential);

  await prisma.siteCredential.update({
    where: { siteId: site.id },
    data: {
      lastTestStatus: result.ok ? "PASS" : "FAIL",
      lastTestMessage: result.message,
      lastTestedAt: new Date()
    }
  });

  await prisma.connectedSite.update({
    where: { id: site.id },
    data: {
      apiStatus: result.ok ? "CONNECTED" : "NEEDS_ATTENTION",
      status: result.ok ? "Connected" : "Needs review",
      lastSyncLabel: "Just now"
    }
  });

  revalidateAppViews();
  redirect(`/connected-sites?tested=${result.ok ? "pass" : "fail"}`);
}

function parseSiteForm(formData: FormData, fallbackOwner: string): SiteInput {
  const siteName = cleanText(formData.get("siteName"), "New client site");
  const domain = cleanDomain(formData.get("domain"));
  const ownerName = cleanText(formData.get("ownerName"), fallbackOwner);
  const platform = normalizePlatform(String(formData.get("platform") ?? "Webflow"));

  return {
    platform,
    siteName,
    domain,
    ownerName,
    credential: buildCredential(platform, siteName, domain, formData)
  };
}

function buildCredential(platform: Platform, siteName: string, domain: string, formData: FormData): SiteInput["credential"] {
  if (platform === "WordPress") {
    const username = cleanText(formData.get("wordpressUsername"), "");
    const password = cleanSecret(formData.get("wordpressAppPassword"));
    const baseUrl = cleanUrl(formData.get("wordpressUrl"), `https://${domain}/wp-json/wp/v2`);
    const encrypted = encryptCredentialSecret(password);

    return {
      provider: platform,
      authType: "Application password",
      accountLabel: cleanText(formData.get("accountLabel"), `${siteName} WordPress editor`),
      apiBaseUrl: baseUrl,
      externalSiteId: cleanText(formData.get("wordpressSiteId"), domain),
      username,
      shopDomain: "",
      tokenPreview: maskSecret(password),
      ...encrypted,
      secretStored: password.length > 0 && username.length > 0,
      scopes: "posts:read,pages:read,media:read"
    };
  }

  if (platform === "Shopify") {
    const token = cleanSecret(formData.get("shopifyAdminToken"));
    const shopDomain = cleanDomain(formData.get("shopifyShopDomain") || domain);
    const encrypted = encryptCredentialSecret(token);

    return {
      provider: platform,
      authType: "Admin API token",
      accountLabel: cleanText(formData.get("accountLabel"), `${siteName} Shopify admin`),
      apiBaseUrl: `https://${shopDomain}/admin/api/2026-01`,
      externalSiteId: cleanText(formData.get("shopifyStorefrontId"), shopDomain),
      username: "",
      shopDomain,
      tokenPreview: maskSecret(token),
      ...encrypted,
      secretStored: token.length > 0 && shopDomain.length > 0,
      scopes: "read_products,read_orders,read_content"
    };
  }

  const token = cleanSecret(formData.get("webflowToken"));
  const siteId = cleanText(formData.get("webflowSiteId"), domain);
  const encrypted = encryptCredentialSecret(token);

  return {
    provider: platform,
    authType: "Personal access token",
    accountLabel: cleanText(formData.get("accountLabel"), `${siteName} Webflow workspace`),
    apiBaseUrl: "https://api.webflow.com/v2",
    externalSiteId: siteId,
    username: "",
    shopDomain: "",
    tokenPreview: maskSecret(token),
    ...encrypted,
    secretStored: token.length > 0 && siteId.length > 0,
    scopes: "sites:read,cms:read,forms:read"
  };
}

function buildTaskRecommendations(site: {
  siteName: string;
  platform: string;
  seoScore: number;
  uxScore: number;
  speedScore: number;
  credential?: { authType: string; externalSiteId: string; secretStored: boolean } | null;
}) {
  const platform = normalizePlatform(site.platform);
  const connectionNote = site.credential?.secretStored
    ? `Use the ${site.credential.authType} connection (${site.credential.externalSiteId || "workspace scope"}) to verify the affected records.`
    : "Credential metadata is incomplete, so keep this task in review until access is confirmed.";
  const tasks = [
    {
      title: `Refresh ${platform} metadata for ${site.siteName}`,
      description: `Rewrite the SEO title and meta description around the strongest buyer intent. ${connectionNote}`,
      priority: site.seoScore < 75 ? "HIGH" : "MEDIUM",
      dueLabel: "Today",
      impact: "SEO"
    },
    {
      title: `Sharpen the primary CTA on ${site.siteName}`,
      description: "Reduce competing actions and make the next step clear for first-time visitors.",
      priority: site.uxScore < 78 ? "HIGH" : "MEDIUM",
      dueLabel: "Tomorrow",
      impact: "Conversion"
    },
    {
      title: `Compress heavy media on ${site.siteName}`,
      description: "Flag large images and replace them with optimized assets before the next campaign.",
      priority: site.speedScore < 74 ? "HIGH" : "MEDIUM",
      dueLabel: "This week",
      impact: "Speed"
    }
  ];

  if (platform === "Shopify") {
    tasks.push({
      title: `Improve Shopify product proof for ${site.siteName}`,
      description: "Add outcome-led bullets, shipping clarity, and trust cues to the top collection.",
      priority: "MEDIUM",
      dueLabel: "This week",
      impact: "Revenue"
    });
  }

  if (platform === "WordPress") {
    tasks.push({
      title: `Repair WordPress content paths for ${site.siteName}`,
      description: "Find outdated internal links and connect top posts to the strongest conversion page.",
      priority: "HIGH",
      dueLabel: "Friday",
      impact: "Content"
    });
  }

  return tasks;
}

function buildAuditSummary(siteName: string, platform: Platform, tasks: ReturnType<typeof buildTaskRecommendations>) {
  const taskList = tasks.map((task) => task.impact.toLowerCase()).join(", ");
  return `${siteName} needs focused ${platform} improvements across ${taskList}. The generated tasks are ready for agency review.`;
}

async function testPlatformCredential(
  platform: string,
  credential: {
    apiBaseUrl: string;
    externalSiteId: string;
    username: string;
    shopDomain: string;
    secretStored: boolean;
    encryptedSecret: string;
    encryptionIv: string;
    encryptionTag: string;
  }
) {
  try {
    if (platform === "Webflow") {
      const token = readCredentialSecret(credential) || process.env.WEBFLOW_API_TOKEN;
      if (!token) {
        return credential.secretStored
          ? { ok: false, message: "Encrypted Webflow token is missing. Re-add this site with the API token." }
          : { ok: false, message: "Add Webflow site ID and token metadata before testing this connection." };
      }

      const response = await fetchWithTimeout(`${credential.apiBaseUrl}/sites/${credential.externalSiteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.ok
        ? { ok: true, message: "Webflow API responded successfully." }
        : { ok: false, message: `Webflow API returned ${response.status}.` };
    }

    if (platform === "WordPress") {
      const password = readCredentialSecret(credential) || process.env.WORDPRESS_APP_PASSWORD;
      if (!password) {
        return credential.secretStored
          ? { ok: false, message: "Encrypted WordPress application password is missing. Re-add this site with the app password." }
          : { ok: false, message: "Add WordPress username and application password metadata before testing this connection." };
      }

      const headers: Record<string, string> = {};
      if (credential.username) {
        headers.Authorization = `Basic ${Buffer.from(`${credential.username}:${password}`).toString("base64")}`;
      }

      const response = await fetchWithTimeout(`${credential.apiBaseUrl.replace(/\/$/, "")}/posts?per_page=1`, { headers });
      return response.ok
        ? { ok: true, message: "WordPress REST API responded successfully." }
        : { ok: false, message: `WordPress REST API returned ${response.status}.` };
    }

    const token = readCredentialSecret(credential) || process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const shopDomain = credential.shopDomain || process.env.SHOPIFY_SHOP_DOMAIN;
    if (!token || !shopDomain) {
      return credential.secretStored
        ? { ok: false, message: "Encrypted Shopify Admin API token is missing. Re-add this site with the admin token." }
        : { ok: false, message: "Add Shopify shop domain and Admin API token metadata before testing this connection." };
    }

    const response = await fetchWithTimeout(`https://${shopDomain}/admin/api/2026-01/shop.json`, {
      headers: { "X-Shopify-Access-Token": token }
    });
    return response.ok
      ? { ok: true, message: "Shopify Admin API responded successfully." }
      : { ok: false, message: `Shopify Admin API returned ${response.status}.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connection test failed.";
    return { ok: false, message };
  }
}

function encryptCredentialSecret(secret: string) {
  if (!secret) {
    return {
      encryptedSecret: "",
      encryptionIv: "",
      encryptionTag: ""
    };
  }

  return encryptSecret(secret);
}

function readCredentialSecret(credential: {
  encryptedSecret: string;
  encryptionIv: string;
  encryptionTag: string;
  secretStored: boolean;
}) {
  if (!credential.secretStored) return "";
  if (!credential.encryptedSecret || !credential.encryptionIv || !credential.encryptionTag) return "";

  return decryptSecret({
    encryptedSecret: credential.encryptedSecret,
    encryptionIv: credential.encryptionIv,
    encryptionTag: credential.encryptionTag
  });
}

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

function revalidateAppViews() {
  revalidatePath("/dashboard");
  revalidatePath("/connected-sites");
  revalidatePath("/ai-audit");
  revalidatePath("/tasks");
  revalidatePath("/client-requests");
}

function cleanText(value: FormDataEntryValue | null, fallback: string) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text.slice(0, 140) : fallback;
}

function cleanSecret(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().slice(0, 2000);
}

function cleanDomain(value: FormDataEntryValue | null | false) {
  const text = String(value || "")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  return text.length > 0 ? text.slice(0, 100) : "new-site.example";
}

function cleanUrl(value: FormDataEntryValue | null, fallback: string) {
  const text = String(value ?? "").trim();
  if (text.length === 0) return fallback;
  return (text.startsWith("http") ? text : `https://${text}`).replace(/\/$/, "").slice(0, 180);
}

function maskSecret(secret: string) {
  if (secret.length === 0) return "";
  if (secret.length <= 8) return `${secret.slice(0, 2)}...${secret.slice(-2)}`;
  return `${secret.slice(0, 5)}...${secret.slice(-4)}`;
}

function imageForPlatform(platform: Platform) {
  if (platform === "WordPress") {
    return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80";
  }

  if (platform === "Shopify") {
    return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80";
  }

  return "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80";
}

function scoreFromSeed(seed: number, min: number, max: number) {
  return min + (Math.abs(seed) % (max - min + 1));
}

function hashText(value: string) {
  return value.split("").reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
