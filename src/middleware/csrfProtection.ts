import { NextFunction, Request, Response } from "express";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// callbacks de google oauth son redirects del browser, no requests ajax del frontend
const EXEMPT_PATH_PREFIXES = ["/auth/google"];

export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method) || EXEMPT_PATH_PREFIXES.some((prefix) => req.path.startsWith(prefix))) {
    next();
    return;
  }

  if (!req.headers["x-requested-with"]) {
    res.status(403).json({ success: false, message: "Missing required header" });
    return;
  }

  next();
}
