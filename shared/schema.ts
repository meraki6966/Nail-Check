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
