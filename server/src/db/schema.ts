import { pgTable, serial, text, integer, timestamp, doublePrecision, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["RESPONSABLE_ENERGIE", "UTILISATEUR", "ADMIN"]);
export const assetTypeEnum = pgEnum("asset_type", ["SITE", "TGBT", "ARMOIRE", "LIGNE", "EQUIPEMENT"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("UTILISATEUR"),
});

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), 
  parentId: integer("parent_id"), 
});

export const measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  voltage: doublePrecision("voltage"),
  intensity: doublePrecision("intensity"),
  power: doublePrecision("power"),
  timestamp: timestamp("timestamp").defaultNow(),
});