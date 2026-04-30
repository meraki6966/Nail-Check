import type { RequestHandler, Request } from "express";

export function getSessionUserId(req: Request): string | null {
  const id = (req.session as any)?.user?.id;
  return id !== undefined && id !== null ? String(id) : null;
}

export function getSessionUserEmail(req: Request): string | null {
  const email = (req.session as any)?.user?.email;
  return email ? String(email).toLowerCase() : null;
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!getSessionUserId(req)) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  next();
};

function getAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || "";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

function getAdminUserIds(): Set<string> {
  const raw = process.env.ADMIN_USER_IDS || "";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

export const isAdmin: RequestHandler = (req, res, next) => {
  const userId = getSessionUserId(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const adminIds = getAdminUserIds();
  const adminEmails = getAdminEmails();
  const email = getSessionUserEmail(req);

  const isAdminUser =
    adminIds.has(userId) || (email !== null && adminEmails.has(email));

  if (!isAdminUser) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

export function assertSessionSecret(): void {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.trim().length < 16) {
    throw new Error(
      "SESSION_SECRET environment variable is not set or is too short. " +
        "Set a strong, random value (>= 16 chars) before starting the server.",
    );
  }
}
