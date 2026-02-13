import { db } from "./db";
import {
  tutorials,
  savedDesigns,
  type Tutorial,
  type InsertTutorial,
  type SavedDesign,
  type InsertSavedDesign,
} from "@shared/schema";
import { eq, ilike, or, and, desc } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth";

export interface IStorage extends IAuthStorage {
  getTutorials(filters?: { search?: string; style?: string; difficulty?: string }): Promise<Tutorial[]>;
  getTutorial(id: number): Promise<Tutorial | undefined>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  
  // Fire Vault methods
  getSavedDesigns(userId?: string): Promise<SavedDesign[]>;
  getSavedDesign(id: number): Promise<SavedDesign | undefined>;
  saveDesign(design: InsertSavedDesign): Promise<SavedDesign>;
  deleteDesign(id: number): Promise<void>;
  toggleFavorite(id: number): Promise<SavedDesign>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods (delegated/inherited from authStorage implementation pattern)
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
}

export const storage = new DatabaseStorage();
