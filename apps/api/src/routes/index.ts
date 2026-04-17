import { Router } from "express";
import { runAudit } from "../controllers/audit-controller.js";
import { syncSite } from "../controllers/site-controller.js";

export const apiRouter = Router();

apiRouter.get("/health", (_request, response) => {
  response.json({ ok: true, service: "omnisite-api" });
});

apiRouter.post("/sites/sync", syncSite);
apiRouter.post("/audits/run", runAudit);