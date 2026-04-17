export async function fetchShopifyMetadata(domain: string) {
  return {
    platform: "shopify",
    domain,
    apiStatus: "mocked",
    products: 128,
    openOrders: 14,
    lastSyncedAt: new Date().toISOString()
  };
}