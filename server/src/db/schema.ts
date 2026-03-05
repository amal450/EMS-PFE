import { pgTable, serial, text, integer, pgEnum } from "drizzle-orm/pg-core";

// 1. تعريف الأدوار (Roles)
export const roleEnum = pgEnum("role", ["RESPONSABLE_ENERGIE", "UTILISATEUR"]);

// 2. جدول المستخدمين (Users)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").default("UTILISATEUR"),
});

// 3. تعريف أنواع الأصول (Asset Types)
export const assetTypeEnum = pgEnum("asset_type", [
  "SITE", 
  "TGBT", 
  "ARMOIRE", 
  "LIGNE", 
  "EQUIPEMENT"
]);

// 4. جدول الأصول (Assets) - الهيكل الشجري
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: assetTypeEnum("type").notNull(),
  parentId: integer("parent_id"), 
  description: text("description"),
});