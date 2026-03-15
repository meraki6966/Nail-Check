// Export WordPress authentication
export { setupAuth, registerAuthRoutes, isAuthenticated, isPaidMember, getSession } from "./railwayauth";

// Keep storage export for compatibility
export { authStorage, type IAuthStorage } from "./storage";