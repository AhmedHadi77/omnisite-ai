import type { NextFunction, Request, Response } from "express";

export function requireAuth(_request: Request, _response: Response, next: NextFunction) {
  next();
}