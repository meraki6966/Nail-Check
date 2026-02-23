// WordPress Content Sync Helper
// Syncs content from Railway Admin to WordPress

const WORDPRESS_API_URL = "https://nail-check.com/wp-json/nail-check/v1";
const API_SECRET = "nc_railway_auth_2026_secret_key";

interface SyncResult {
  success: boolean;
  wordpress_id?: number;
  error?: string;
}

// Headers for API calls
const getHeaders = () => ({
  "Content-Type": "application/json",
  "X-API-Key": API_SECRET,
});

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
    const response = await fetch(`${WORDPRESS_API_URL}/content/gallery`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to sync gallery to WordPress:", error);
    return { success: false, error: "Sync failed" };
  }
}

export async function deleteGalleryFromWordPress(wordpressId: number): Promise<SyncResult> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/content/gallery/${wordpressId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to delete gallery from WordPress:", error);
    return { success: false, error: "Delete failed" };
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
    const response = await fetch(`${WORDPRESS_API_URL}/content/tutorials`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to sync tutorial to WordPress:", error);
    return { success: false, error: "Sync failed" };
  }
}

export async function deleteTutorialFromWordPress(wordpressId: number): Promise<SyncResult> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/content/tutorials/${wordpressId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to delete tutorial from WordPress:", error);
    return { success: false, error: "Delete failed" };
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
    const response = await fetch(`${WORDPRESS_API_URL}/content/seasonal`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to sync seasonal to WordPress:", error);
    return { success: false, error: "Sync failed" };
  }
}

export async function deleteSeasonalFromWordPress(wordpressId: number): Promise<SyncResult> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/content/seasonal/${wordpressId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to delete seasonal from WordPress:", error);
    return { success: false, error: "Delete failed" };
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
    const response = await fetch(`${WORDPRESS_API_URL}/content/supplies`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to sync supply to WordPress:", error);
    return { success: false, error: "Sync failed" };
  }
}

export async function deleteSupplyFromWordPress(wordpressId: number): Promise<SyncResult> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/content/supplies/${wordpressId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to delete supply from WordPress:", error);
    return { success: false, error: "Delete failed" };
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
    const response = await fetch(`${WORDPRESS_API_URL}/content/techs`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to sync tech to WordPress:", error);
    return { success: false, error: "Sync failed" };
  }
}

export async function deleteTechFromWordPress(wordpressId: number): Promise<SyncResult> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/content/techs/${wordpressId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to delete tech from WordPress:", error);
    return { success: false, error: "Delete failed" };
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
    const response = await fetch(`${WORDPRESS_API_URL}/flavor-of-month`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return result;
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
    const response = await fetch(`${WORDPRESS_API_URL}/flavor-of-month`);
    return await response.json();
  } catch (error) {
    console.error("Failed to get flavor of month:", error);
    return null;
  }
}