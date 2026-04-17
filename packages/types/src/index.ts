export type Platform = "webflow" | "wordpress" | "shopify";
export type ApiStatus = "connected" | "needs_attention" | "disconnected" | "mocked";

export type ConnectedSite = {
  id: string;
  workspaceId: string;
  platform: Platform;
  siteName: string;
  domain: string;
  apiStatus: ApiStatus;
};

export type AuditScore = {
  seoScore: number;
  uxScore: number;
  speedScore: number;
  aiSummary: string;
};