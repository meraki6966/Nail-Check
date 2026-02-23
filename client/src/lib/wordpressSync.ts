// WordPress Content Sync Helper
// Calls Railway server-side routes which then sync to WordPress

interface SyncResult {
  success: boolean;
  wordpress_id?: number;
  error?: string;
}

// ============================================
// GALLERY SYNC
// ============================================
export async function syncGalleryToWordPress(data: {
  title: string;
  imageUrl: string;
  category: string;
  tags: string[];
  description?: string;
  memberOnly?: boolean;
  railwayId?: number;
}): Promise<SyncResult> {
  try {
    const response = await fetch("/api/sync/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Failed to sync gallery:", error);
    return { success: false, error: "Sync failed" };
  }
}

// ============================================
// TUTORIAL SYNC
// ============================================
export async function syncTutorialToWordPress(data: {
  title: string;
  imageSource: string;
  styleCategory: string;
  difficultyLevel: string;
  toolsRequired: string[];
  tutorialContent: string;
  creatorCredit?: string;
  railwayId?: number;
}): Promise<SyncResult> {
  try {
    const response = await fetch("/api/sync/tutorial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Failed to sync tutorial:", error);
    return { success: false, error: "Sync failed" };
  }
}

// ============================================
// SEASONAL SYNC
// ============================================
export async function syncSeasonalToWordPress(data: {
  title: string;
  imageUrl: string;
  season: string;
  category: string;
  description?: string;
  tags: string[];
  featured?: boolean;
  railwayId?: number;
}): Promise<SyncResult> {
  try {
    const response = await fetch("/api/sync/seasonal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Failed to sync seasonal:", error);
    return { success: false, error: "Sync failed" };
  }
}

// ============================================
// SUPPLY SYNC
// ============================================
export async function syncSupplyToWordPress(data: {
  name: string;
  brand?: string;
  category: string;
  description?: string;
  imageUrl?: string;
  productUrl?: string;
  price?: string;
  utility?: string;
  tags: string[];
  featured?: boolean;
  memberOnly?: boolean;
  railwayId?: number;
}): Promise<SyncResult> {
  try {
    const response = await fetch("/api/sync/supply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Failed to sync supply:", error);
    return { success: false, error: "Sync failed" };
  }
}

// ============================================
// TECH SYNC
// ============================================
export async function syncTechToWordPress(data: {
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  city: string;
  state: string;
  zipCode: string;
  bio: string;
  imageUrl?: string;
  bookingUrl?: string;
  instagram?: string;
  website?: string;
  skillLevel?: string;
  specialties?: string[];
  approved?: boolean;
  railwayId?: number;
}): Promise<SyncResult> {
  try {
    const response = await fetch("/api/sync/tech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Failed to sync tech:", error);
    return { success: false, error: "Sync failed" };
  }
}

// ============================================
// FLAVOR OF THE MONTH
// ============================================
export async function updateFlavorOfMonth(data: {
  title: string;
  description: string;
  image: string;
}): Promise<SyncResult> {
  try {
    const response = await fetch("/api/sync/flavor-of-month", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Failed to update flavor of month:", error);
    return { success: false, error: "Update failed" };
  }
}

export async function getFlavorOfMonth(): Promise<{
  title: string;
  description: string;
  image: string;
} | null> {
  try {
    const response = await fetch("/api/sync/flavor-of-month");
    return await response.json();
  } catch (error) {
    console.error("Failed to get flavor of month:", error);
    return null;
  }
}