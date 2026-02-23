// Export WordPress authentication
export { setupAuth, registerAuthRoutes, isAuthenticated, isPaidMember, getSession } from "./wordpressAuth";

// Keep storage export for compatibility
export { authStorage, type IAuthStorage } from "./storage";