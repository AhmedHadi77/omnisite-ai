import { buildAuditPrompt } from "../ai/audit-prompt.js";

export async function createAuditSummary(input: unknown) {
  const prompt = buildAuditPrompt(input);

  return {
    seoScore: 82,
    uxScore: 76,
    speedScore: 71,
    aiSummary: "Improve metadata intent, simplify the primary CTA, and compress heavy media before launch.",
    promptPreview: prompt.slice(0, 220)
  };
}