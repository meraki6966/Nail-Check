import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/chat";
export * from "./models/auth";

export const tutorials = pgTable("tutorials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSource: text("image_source").notNull(),
  styleCategory: text("style_category").notNull(), // e.g., French, Chrome
  difficultyLevel: text("difficulty_level").notNull(), // Beginner, Intermediate, Pro
  toolsRequired: text("tools_required").array().notNull(),
  tutorialContent: text("tutorial_content").notNull(),
  creatorCredit: text("creator_credit"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTutorialSchema = createInsertSchema(tutorials).omit({ 
  id: true, 
  createdAt: true 
});

export type Tutorial = typeof tutorials.$inferSelect;
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;

// FIRE VAULT - Saved Designs
export const savedDesigns = pgTable("saved_designs", {
  id: serial("id").primaryKey(),
  userId: text("user_id"), // Optional for now since we don't have auth yet
  imageUrl: text("image_url").notNull(), // URL or base64 of the generated image
  prompt: text("prompt").notNull(), // The prompt used to generate it
  canvasImageUrl: text("canvas_image_url"), // Original canvas image if uploaded
  tags: text("tags").array(), // Tags like ["spikey", "black", "long"]
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
// SEASONAL VAULT
export const seasonalDesigns = pgTable("seasonal_designs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  season: text("season").notNull(), // Winter, Spring, Summer, Fall, Holiday
  category: text("category"), // e.g., "Valentine's", "Christmas", "Beach"
  description: text("description"),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSeasonalDesignSchema = createInsertSchema(seasonalDesigns).omit({
  id: true,
  createdAt: true,
});

export type SeasonalDesign = typeof seasonalDesigns.$inferSelect;
export type InsertSeasonalDesign = z.infer<typeof insertSeasonalDesignSchema>;
export const insertSavedDesignSchema = createInsertSchema(savedDesigns).omit({
  id: true,
  createdAt: true,
});

export type SavedDesign = typeof savedDesigns.$inferSelect;
export type InsertSavedDesign = z.infer<typeof insertSavedDesignSchema>;
