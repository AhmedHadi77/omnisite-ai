import type { Request, Response } from "express";
import { syncPlatformSite } from "../services/site-service.js";

export async function syncSite(request: Request, response: Response) {
  const site = await syncPlatformSite(request.body);
  response.json(site);
}