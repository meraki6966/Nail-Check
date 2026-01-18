import { db } from "./db";
import {
  tutorials,
  type Tutorial,
  type InsertTutorial,
} from "@shared/schema";
import { eq, ilike, or, and } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth";

export interface IStorage extends IAuthStorage {
  getTutorials(filters?: { search?: string; style?: string; difficulty?: string }): Promise<Tutorial[]>;
  getTutorial(id: number): Promise<Tutorial | undefined>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
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
}

export const storage = new DatabaseStorage();
