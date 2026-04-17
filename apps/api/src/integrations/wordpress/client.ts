export async function fetchWordPressMetadata(domain: string) {
  return {
    platform: "wordpress",
    domain,
    apiStatus: "mocked",
    posts: 42,
    brokenLinks: 7,
    lastSyncedAt: new Date().toISOString()
  };
}