import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

// WordPress API configuration - using standalone auth file
const WORDPRESS_URL = "https://nail-check.com/nc-auth.php";
const API_SECRET = "nc_railway_auth_2026_secret_key";

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
  console.log("WordPress auth initialized with standalone auth file");
  console.log("AUTH ENDPOINT:", WORDPRESS_URL);
}

/**
 * Verify credentials with WordPress
 */
async function verifyWithWordPress(email: string, password: string): Promise<{
  success: boolean;
  user?: SessionUser;
  error?: string;
  message?: string;
}> {
  try {
    const fullUrl = `${WORDPRESS_URL}?action=verify`;
    console.log("DEBUG: Calling WordPress auth URL:", fullUrl);
    console.log("DEBUG: Using API Secret:", API_SECRET);
    
    // Use standalone auth file that bypasses ALL WordPress routing and caching
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_SECRET,
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("DEBUG: Response status:", response.status);
    console.log("DEBUG: Response Content-Type:", response.headers.get('content-type'));
    
    const rawText = await response.text();
    console.log("DEBUG: Raw response (first 200 chars):", rawText.substring(0, 200));
    
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("DEBUG: JSON parse failed:", parseError);
      console.error("DEBUG: Full response text:", rawText);
      throw new Error("WordPress returned non-JSON response");
    }

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || "LOGIN_ERROR",
        message: data.message || "Login failed",
      };
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        displayName: data.user.displayName,
        isPaidMember: data.membership?.isPaidMember || false,
        membershipPlan: data.membership?.plan || null,
        membershipStatus: data.membership?.status || "none",
      },
      message: data.message,
    };
  } catch (error) {
    console.error("WordPress auth error:", error);
    return {
      success: false,
      error: "NETWORK_ERROR",
      message: "Connection error. Please try again.",
    };
  }
}

/**
 * Register user with WordPress
 */
async function registerWithWordPress(
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
    // Use standalone auth file that bypasses ALL WordPress routing and caching
    const response = await fetch(`${WORDPRESS_URL}?action=register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_SECRET,
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || "REGISTRATION_ERROR",
        message: data.message || "Registration failed",
      };
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        displayName: data.user.displayName,
        isPaidMember: data.membership?.isPaidMember || false,
        membershipPlan: data.membership?.plan || null,
        membershipStatus: data.membership?.status || "none",
      },
      message: data.message,
    };
  } catch (error) {
    console.error("WordPress registration error:", error);
    return {
      success: false,
      error: "NETWORK_ERROR",
      message: "Connection error. Please try again.",
    };
  }
}

/**
 * Check membership status with WordPress
 */
async function checkMembershipStatus(userId: number): Promise<{
  isPaidMember: boolean;
  plan: string | null;
  status: string;
}> {
  try {
    // Use standalone auth file that bypasses ALL WordPress routing and caching
    const response = await fetch(`${WORDPRESS_URL}?action=membership&user_id=${userId}`, {
      headers: {
        "X-API-Key": API_SECRET,
      },
    });

    const data = await response.json();

    if (data.success && data.membership) {
      return {
        isPaidMember: data.membership.isPaidMember,
        plan: data.membership.plan,
        status: data.membership.status,
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

      const result = await verifyWithWordPress(email, password);

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

      const result = await registerWithWordPress(email, password, firstName || "", lastName || "");

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
