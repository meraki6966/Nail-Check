import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";
import { db } from "../../db";
import { sql } from "drizzle-orm";

// Session user type
interface SessionUser {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  isPaidMember: boolean;
  membershipPlan: string | null;
  membershipStatus: string;
}

// Extend Express types
declare global {
  namespace Express {
    interface User extends SessionUser {}
  }
}

declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
  }
}

/**
 * Setup session middleware
 */
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || "nail-check-secret-key-change-me",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
      sameSite: "lax",
    },
  });
}

/**
 * Setup auth middleware
 */
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  console.log("Railway native auth initialized with PostgreSQL");
}

/**
 * Verify credentials with PostgreSQL
 */
async function verifyWithDatabase(email: string, password: string): Promise<{
  success: boolean;
  user?: SessionUser;
  error?: string;
  message?: string;
}> {
  try {
    // Query user from database
    const result = await db.execute(sql`
      SELECT id, email, username, password_hash, first_name, last_name, display_name,
             is_paid_member, membership_plan, membership_status
      FROM users
      WHERE email = ${email.toLowerCase()}
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return {
        success: false,
        error: "LOGIN_ERROR",
        message: "Invalid credentials",
      };
    }

    const user = result.rows[0] as any;

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return {
        success: false,
        error: "LOGIN_ERROR",
        message: "Invalid credentials",
      };
    }

    // Update last login
    await db.execute(sql`
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        displayName: user.display_name || user.username,
        isPaidMember: user.is_paid_member || false,
        membershipPlan: user.membership_plan || null,
        membershipStatus: user.membership_status || "none",
      },
      message: "Login successful",
    };
  } catch (error) {
    console.error("Database auth error:", error);
    return {
      success: false,
      error: "NETWORK_ERROR",
      message: "Connection error. Please try again.",
    };
  }
}

/**
 * Register user in PostgreSQL
 */
async function registerWithDatabase(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{
  success: boolean;
  user?: SessionUser;
  error?: string;
  message?: string;
}> {
  try {
    const emailLower = email.toLowerCase();
    
    // Check if user exists
    const existing = await db.execute(sql`
      SELECT id FROM users WHERE email = ${emailLower} LIMIT 1
    `);

    if (existing.rows.length > 0) {
      return {
        success: false,
        error: "EMAIL_EXISTS",
        message: "Email already registered",
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate username from email
    const username = emailLower.split('@')[0];
    const displayName = firstName && lastName 
      ? `${firstName} ${lastName}` 
      : username;

    // Create user
    const result = await db.execute(sql`
      INSERT INTO users (
        email, username, password_hash, first_name, last_name, display_name,
        is_paid_member, membership_status
      )
      VALUES (
        ${emailLower}, ${username}, ${passwordHash}, ${firstName || ''}, 
        ${lastName || ''}, ${displayName}, false, 'none'
      )
      RETURNING id, email, username, first_name, last_name, display_name,
                is_paid_member, membership_plan, membership_status
    `);

    const user = result.rows[0] as any;

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        displayName: user.display_name || user.username,
        isPaidMember: user.is_paid_member || false,
        membershipPlan: user.membership_plan || null,
        membershipStatus: user.membership_status || "none",
      },
      message: "Registration successful",
    };
  } catch (error) {
    console.error("Database registration error:", error);
    return {
      success: false,
      error: "REGISTRATION_ERROR",
      message: "Registration failed. Please try again.",
    };
  }
}

/**
 * Check membership status from PostgreSQL
 */
async function checkMembershipStatus(userId: number): Promise<{
  isPaidMember: boolean;
  plan: string | null;
  status: string;
}> {
  try {
    const result = await db.execute(sql`
      SELECT is_paid_member, membership_plan, membership_status
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `);

    if (result.rows.length > 0) {
      const user = result.rows[0] as any;
      return {
        isPaidMember: user.is_paid_member || false,
        plan: user.membership_plan || null,
        status: user.membership_status || "none",
      };
    }
  } catch (error) {
    console.error("Membership check error:", error);
  }

  return {
    isPaidMember: false,
    plan: null,
    status: "none",
  };
}

/**
 * Register auth routes
 */
export function registerAuthRoutes(app: Express): void {
  
  // Login
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await verifyWithDatabase(email, password);

      if (!result.success || !result.user) {
        return res.status(401).json({
          success: false,
          error: result.error,
          message: result.message,
        });
      }

      // Store user in session
      req.session.user = result.user;

      res.json({
        success: true,
        message: result.message,
        user: result.user,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed. Please try again.",
      });
    }
  });

  // Register
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await registerWithDatabase(email, password, firstName || "", lastName || "");

      if (!result.success || !result.user) {
        return res.status(400).json({
          success: false,
          error: result.error,
          message: result.message,
        });
      }

      // Store user in session
      req.session.user = result.user;

      res.status(201).json({
        success: true,
        message: result.message,
        user: result.user,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed. Please try again.",
      });
    }
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    res.json({
      success: true,
      user: req.session.user,
    });
  });

  // Refresh membership status
  app.post("/api/refresh-membership", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const membership = await checkMembershipStatus(req.session.user.id);

    // Update session
    req.session.user.isPaidMember = membership.isPaidMember;
    req.session.user.membershipPlan = membership.plan;
    req.session.user.membershipStatus = membership.status;

    res.json({
      success: true,
      membership,
      user: req.session.user,
    });
  });

  // Logout
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
          success: false,
          message: "Logout failed",
        });
      }

      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });

  // Legacy logout (GET)
  app.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.redirect("/");
    });
  });
}

/**
 * Middleware to check if user is authenticated
 */
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
  next();
};

/**
 * Middleware to check if user is a paid member
 */
export const isPaidMember: RequestHandler = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  if (!req.session.user.isPaidMember) {
    return res.status(403).json({
      success: false,
      message: "Membership required",
      showPaywall: true,
    });
  }

  next();
};