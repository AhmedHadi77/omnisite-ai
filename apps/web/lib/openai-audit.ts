import type { Platform } from "./demo-data";

type AuditSite = {
  siteName: string;
  platform: string;
  domain: string;
  seoScore: number;
  uxScore: number;
  speedScore: number;
  credential?: {
    authType: string;
    externalSiteId: string;
    secretStored: boolean;
    scopes: string;
  } | null;
};

export type GeneratedAuditTask = {
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueLabel: string;
  impact: string;
};

export type GeneratedAudit = {
  seoScore: number;
  uxScore: number;
  speedScore: number;
  aiSummary: string;
  tasks: GeneratedAuditTask[];
};

export async function generateSiteAudit(site: AuditSite): Promise<GeneratedAudit> {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackAudit(site);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        instructions:
          "You are an expert agency website operations lead. Return practical, specific tasks for Webflow, WordPress, or Shopify specialists. Keep descriptions concise and implementation-ready.",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify(
                  {
                    site,
                    requiredOutput:
                      "Return JSON only with seoScore, uxScore, speedScore, aiSummary, and 3-5 tasks. Task priority must be HIGH, MEDIUM, or LOW."
                  },
                  null,
                  2
                )
              }
            ]
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "omnisite_audit",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["seoScore", "uxScore", "speedScore", "aiSummary", "tasks"],
              properties: {
                seoScore: { type: "integer", minimum: 0, maximum: 100 },
                uxScore: { type: "integer", minimum: 0, maximum: 100 },
                speedScore: { type: "integer", minimum: 0, maximum: 100 },
                aiSummary: { type: "string" },
                tasks: {
                  type: "array",
                  minItems: 3,
                  maxItems: 5,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["title", "description", "priority", "dueLabel", "impact"],
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      priority: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
                      dueLabel: { type: "string" },
                      impact: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      })
    });

    if (!response.ok) {
      return fallbackAudit(site, `OpenAI request failed with ${response.status}.`);
    }

    const payload = await response.json();
    const outputText = extractOutputText(payload);
    if (!outputText) return fallbackAudit(site, "OpenAI returned no text output.");

    return normalizeAudit(JSON.parse(outputText), site);
  } catch (error) {
    const message = error instanceof Error ? error.message : "OpenAI audit failed.";
    return fallbackAudit(site, message);
  }
}

function normalizeAudit(value: GeneratedAudit, site: AuditSite): GeneratedAudit {
  return {
    seoScore: clamp(value.seoScore ?? site.seoScore + 4, 0, 100),
    uxScore: clamp(value.uxScore ?? site.uxScore + 3, 0, 100),
    speedScore: clamp(value.speedScore ?? site.speedScore + 5, 0, 100),
    aiSummary: value.aiSummary || `${site.siteName} has a fresh AI audit ready for review.`,
    tasks: value.tasks?.length ? value.tasks.slice(0, 5).map(normalizeTask) : fallbackAudit(site).tasks
  };
}

function normalizeTask(task: GeneratedAuditTask): GeneratedAuditTask {
  return {
    title: task.title.slice(0, 140),
    description: task.description.slice(0, 360),
    priority: task.priority === "HIGH" || task.priority === "LOW" ? task.priority : "MEDIUM",
    dueLabel: task.dueLabel.slice(0, 40) || "This week",
    impact: task.impact.slice(0, 40) || "Site health"
  };
}

function fallbackAudit(site: AuditSite, reason?: string): GeneratedAudit {
  const platform = normalizePlatform(site.platform);
  const connectionNote = site.credential?.secretStored
    ? `Use the ${site.credential.authType} connection (${site.credential.externalSiteId || "workspace scope"}) to verify affected records.`
    : "Credential metadata is incomplete, so keep this task in review until access is confirmed.";

  const tasks: GeneratedAuditTask[] = [
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

  return {
    seoScore: clamp(site.seoScore + 4, 0, 100),
    uxScore: clamp(site.uxScore + 3, 0, 100),
    speedScore: clamp(site.speedScore + 5, 0, 100),
    aiSummary: reason
      ? `${site.siteName} used the local audit fallback. ${reason}`
      : `${site.siteName} needs focused ${platform} improvements across SEO, conversion, and speed.`,
    tasks
  };
}

function extractOutputText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  if ("output_text" in payload && typeof payload.output_text === "string") return payload.output_text;

  const output = "output" in payload && Array.isArray(payload.output) ? payload.output : [];
  for (const item of output) {
    if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (content && typeof content === "object" && "text" in content && typeof content.text === "string") {
        return content.text;
      }
    }
  }

  return "";
}

function normalizePlatform(platform: string): Platform {
  const value = platform.toLowerCase();
  if (value === "wordpress") return "WordPress";
  if (value === "shopify") return "Shopify";
  return "Webflow";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
