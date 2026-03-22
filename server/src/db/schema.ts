import { pgTable, serial, text, integer, timestamp, doublePrecision, pgEnum } from "drizzle-orm/pg-core";

// Enums kima 9bal
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

// --- EL MODIFICATION HOUNI: 12 Metrics ---
export const measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  // 3 Courants
  i1: doublePrecision("i1"), i2: doublePrecision("i2"), i3: doublePrecision("i3"),
  // 3 Tensions Simples (V)
  v1: doublePrecision("v1"), v2: doublePrecision("v2"), v3: doublePrecision("v3"),
  // 3 Tensions Composées (U)
  u1: doublePrecision("u1"), u2: doublePrecision("u2"), u3: doublePrecision("u3"),
  // Metrics mel Cahier des charges
  power: doublePrecision("power"),
  frequency: doublePrecision("frequency"),
  cosPhi: doublePrecision("cos_phi"),
  timestamp: timestamp("timestamp").defaultNow(),
});