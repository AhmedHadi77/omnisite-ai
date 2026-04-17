export function buildAuditPrompt(siteContext: unknown) {
  return [
    "You are an agency website operations analyst.",
    "Review the provided platform context and return SEO, UX, speed, content, and conversion recommendations.",
    "Create concrete tasks that a Webflow, WordPress, or Shopify specialist can act on.",
    JSON.stringify(siteContext, null, 2)
  ].join("\n\n");
}