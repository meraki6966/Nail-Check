import { db } from "./db";
import {
  tutorials,
  savedDesigns,
  seasonalDesigns,
  supplyProducts,
  users,
  nailTechs,
  type Tutorial,
  type InsertTutorial,
  type SavedDesign,
  type InsertSavedDesign,
  type SeasonalDesign,
  type InsertSeasonalDesign,
  type SupplyProduct,
  type InsertSupplyProduct,
  type NailTech,
  type InsertNailTech,
} from "@shared/schema";
import { eq, ilike, or, and, desc, sql } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth";

export interface IStorage extends IAuthStorage {
  getTutorials(filters?: { search?: string; style?: string; difficulty?: string }): Promise<Tutorial[]>;
  getTutorial(id: number): Promise<Tutorial | undefined>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  // Creators methods
getCreators(): Promise<NailTech[]>;
getCreatorByUsername(username: string): Promise<NailTech | undefined>;

  // Fire Vault methods
  getSavedDesigns(userId?: string): Promise<SavedDesign[]>;
  getSavedDesign(id: number): Promise<SavedDesign | undefined>;
  saveDesign(design: InsertSavedDesign): Promise<SavedDesign>;
  deleteDesign(id: number): Promise<void>;
  toggleFavorite(id: number): Promise<SavedDesign>;
  
  // Seasonal Vault methods
  getSeasonalDesigns(season?: string): Promise<SeasonalDesign[]>;
  getSeasonalDesign(id: number): Promise<SeasonalDesign | undefined>;
  createSeasonalDesign(design: InsertSeasonalDesign): Promise<SeasonalDesign>;
  getFeaturedSeasonalDesigns(): Promise<SeasonalDesign[]>;
  
  // Supply Suite methods
  getSupplyProducts(category?: string): Promise<SupplyProduct[]>;
  getSupplyProduct(id: number): Promise<SupplyProduct | undefined>;
  createSupplyProduct(product: InsertSupplyProduct): Promise<SupplyProduct>;
  getFeaturedSupplyProducts(): Promise<SupplyProduct[]>;
  searchSupplyProducts(query: string): Promise<SupplyProduct[]>;
  
  // Nail Tech Locator methods
  getNailTechs(zipCode?: string): Promise<NailTech[]>;
  getNailTech(id: number): Promise<NailTech | undefined>;
  createNailTech(tech: InsertNailTech): Promise<NailTech>;
  approveNailTech(id: number): Promise<NailTech>;
  deleteNailTech(id: number): Promise<void>;
  
  // Credit system methods
  incrementGenerationsUsed(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string) {
    return authStorage.getUser(id);
  }

  async upsertUser(user: any) {
    return authStorage.upsertUser(user);
  }

  // Tutorial methods
  async getTutorials(filters?: { search?: string; style?: string; difficulty?: string }): Promise<Tutorial[]> {
    let query = db.select().from(tutorials);
    
    const conditions = [];
    if (filters?.search) {
      conditions.push(or(
        ilike(tutorials.title, `%${filters.search}%`),
        ilike(tutorials.tutorialContent, `%${filters.search}%`)
      ));
    }
    if (filters?.style) {
      conditions.push(eq(tutorials.styleCategory, filters.style));
    }
    if (filters?.difficulty) {
      conditions.push(eq(tutorials.difficultyLevel, filters.difficulty));
    }

    if (conditions.length > 0) {
      // @ts-ignore
      query = query.where(and(...conditions));
    }

    return await query;
  }

  async getTutorial(id: number): Promise<Tutorial | undefined> {
    const [tutorial] = await db.select().from(tutorials).where(eq(tutorials.id, id));
    return tutorial;
  }

  async createTutorial(tutorial: InsertTutorial): Promise<Tutorial> {
    const [newTutorial] = await db.insert(tutorials).values(tutorial).returning();
    return newTutorial;
  }

  // FIRE VAULT METHODS
  async getSavedDesigns(userId?: string): Promise<SavedDesign[]> {
    let query = db.select().from(savedDesigns).orderBy(desc(savedDesigns.createdAt));
    
    if (userId) {
      // @ts-ignore
      query = query.where(eq(savedDesigns.userId, userId));
    }
    
    return await query;
  }

  async getSavedDesign(id: number): Promise<SavedDesign | undefined> {
    const [design] = await db.select().from(savedDesigns).where(eq(savedDesigns.id, id));
    return design;
  }

  async saveDesign(design: InsertSavedDesign): Promise<SavedDesign> {
    const [newDesign] = await db.insert(savedDesigns).values(design).returning();
    return newDesign;
  }

  async deleteDesign(id: number): Promise<void> {
    await db.delete(savedDesigns).where(eq(savedDesigns.id, id));
  }

  async toggleFavorite(id: number): Promise<SavedDesign> {
    const [design] = await db.select().from(savedDesigns).where(eq(savedDesigns.id, id));
    if (!design) {
      throw new Error("Design not found");
    }
    
    const [updated] = await db
      .update(savedDesigns)
      .set({ isFavorite: !design.isFavorite })
      .where(eq(savedDesigns.id, id))
      .returning();
    
    return updated;
  }

  // SEASONAL VAULT METHODS
  async getSeasonalDesigns(season?: string): Promise<SeasonalDesign[]> {
    let query = db.select().from(seasonalDesigns).orderBy(desc(seasonalDesigns.createdAt));
    
    if (season) {
      // @ts-ignore
      query = query.where(eq(seasonalDesigns.season, season));
    }
    
    return await query;
  }

  async getSeasonalDesign(id: number): Promise<SeasonalDesign | undefined> {
    const [design] = await db.select().from(seasonalDesigns).where(eq(seasonalDesigns.id, id));
    return design;
  }

  async createSeasonalDesign(design: InsertSeasonalDesign): Promise<SeasonalDesign> {
    const [newDesign] = await db.insert(seasonalDesigns).values(design).returning();
    return newDesign;
  }

  async getFeaturedSeasonalDesigns(): Promise<SeasonalDesign[]> {
    return await db
      .select()
      .from(seasonalDesigns)
      .where(eq(seasonalDesigns.featured, true))
      .orderBy(desc(seasonalDesigns.createdAt))
      .limit(8);
  }

  // SUPPLY SUITE METHODS
  async getSupplyProducts(category?: string): Promise<SupplyProduct[]> {
    let query = db.select().from(supplyProducts).orderBy(desc(supplyProducts.featured), supplyProducts.name);
    
    if (category) {
      // @ts-ignore
      query = query.where(eq(supplyProducts.category, category));
    }
    
    return await query;
  }

  async getSupplyProduct(id: number): Promise<SupplyProduct | undefined> {
    const [product] = await db.select().from(supplyProducts).where(eq(supplyProducts.id, id));
    return product;
  }

  async createSupplyProduct(product: InsertSupplyProduct): Promise<SupplyProduct> {
    const [newProduct] = await db.insert(supplyProducts).values(product).returning();
    return newProduct;
  }

  async getFeaturedSupplyProducts(): Promise<SupplyProduct[]> {
    return await db
      .select()
      .from(supplyProducts)
      .where(eq(supplyProducts.featured, true))
      .orderBy(supplyProducts.name)
      .limit(12);
  }

  async searchSupplyProducts(query: string): Promise<SupplyProduct[]> {
    return await db
      .select()
      .from(supplyProducts)
      .where(
        or(
          ilike(supplyProducts.name, `%${query}%`),
          ilike(supplyProducts.brand, `%${query}%`),
          ilike(supplyProducts.description, `%${query}%`)
        )
      )
      .orderBy(supplyProducts.name);
  }

  // NAIL TECH LOCATOR METHODS
  async getNailTechs(zipCode?: string): Promise<NailTech[]> {
    let query = db
      .select()
      .from(nailTechs)
      .where(eq(nailTechs.isApproved, true))
      .orderBy(desc(nailTechs.isPremium), desc(nailTechs.createdAt));
    
    const results = await query;
    
    // Filter by zip code prefix if provided
    if (zipCode && zipCode.length >= 3) {
      const zipPrefix = zipCode.substring(0, 3);
      return results.filter(tech => tech.zipCode.startsWith(zipPrefix));
    }
    
    return results;
  }

  async getNailTech(id: number): Promise<NailTech | undefined> {
    const [tech] = await db
      .select()
      .from(nailTechs)
      .where(and(eq(nailTechs.id, id), eq(nailTechs.isApproved, true)));
    return tech;
  }

  async createNailTech(tech: InsertNailTech): Promise<NailTech> {
    const [newTech] = await db
      .insert(nailTechs)
      .values({
        ...tech,
        isApproved: false,
        isPremium: false,
        isVerified: false,
        rating: 0,
        reviewCount: 0,
      })
      .returning();
    return newTech;
  }

  async approveNailTech(id: number): Promise<NailTech> {
    const [tech] = await db
      .update(nailTechs)
      .set({ isApproved: true, updatedAt: new Date() })
      .where(eq(nailTechs.id, id))
      .returning();
    return tech;
  }

  async deleteNailTech(id: number): Promise<void> {
    await db.delete(nailTechs).where(eq(nailTechs.id, id));
  }

  // CREDIT SYSTEM METHODS
  async incrementGenerationsUsed(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        generationsUsed: sql`${users.generationsUsed} + 1`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }
}
// CREATORS METHODS
async getCreators(): Promise<NailTech[]> {
  return await db
    .select()
    .from(nailTechs)
    .where(eq(nailTechs.showInDirectory, true))
    .orderBy(desc(nailTechs.createdAt));
}

async getCreatorByUsername(username: string): Promise<NailTech | undefined> {
  const [creator] = await db
    .select()
    .from(nailTechs)
    .where(
      and(
        eq(nailTechs.username, username),
        eq(nailTechs.showInDirectory, true)
      )
    );
  return creator;
}

export const storage = new DatabaseStorage();