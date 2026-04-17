import type { Request, Response } from "express";
import { createAuditSummary } from "../services/audit-service.js";

export async function runAudit(request: Request, response: Response) {
  const audit = await createAuditSummary(request.body);
  response.json(audit);
}