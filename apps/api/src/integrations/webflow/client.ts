export async function fetchWebflowMetadata(domain: string) {
  return {
    platform: "webflow",
    domain,
    apiStatus: "mocked",
    pages: 18,
    forms: 3,
    lastSyncedAt: new Date().toISOString()
  };
}