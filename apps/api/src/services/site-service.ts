import { fetchShopifyMetadata } from "../integrations/shopify/client.js";
import { fetchWebflowMetadata } from "../integrations/webflow/client.js";
import { fetchWordPressMetadata } from "../integrations/wordpress/client.js";

export async function syncPlatformSite(input: { platform?: string; domain?: string }) {
  if (input.platform === "shopify") return fetchShopifyMetadata(input.domain ?? "demo-store.myshopify.com");
  if (input.platform === "wordpress") return fetchWordPressMetadata(input.domain ?? "wordpress.example");
  return fetchWebflowMetadata(input.domain ?? "webflow.example");
}