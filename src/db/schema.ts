import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  real,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  displayName: text("display_name").notNull(),
  profilePhotoUrl: text("profile_photo_url"),
  googleuserID: text("google_user_id").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
  googleAccessToken: text("google_access_token").notNull(),
  googleRefreshToken: text("google_refresh_token").notNull(),
  tokenExpiry: timestamp("token_expiry").notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`),
  tokenUpdatedAt: timestamp("token_updated_at")
    .default(sql`now()`)
    .notNull(),
});

// Fitness data table: Store daily fitness metrics for users
export const fitnessData = pgTable("fitness_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: timestamp("date").notNull(),
  stepCount: integer("step_count").default(0),
  glucoseLevel: real("glucose_level").default(0),
  systolicBP: real("systolic_bp").default(0),
  diastolicBP: real("diastolic_bp").default(0),
  heartRate: real("heart_rate").default(0),
  weight: real("weight").default(0),
  height: real("height").default(0),
  sleepHours: real("sleep_hours").default(0),
  bodyFatPercentage: real("body_fat_percentage").default(0),
  rawData: jsonb("raw_data").default({}),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Defining relations for efficient queries
export const usersRelations = relations(users, ({ many }) => ({
  fitnessData: many(fitnessData),
}));

export const fitnessDataRelations = relations(fitnessData, ({ one }) => ({
  user: one(users, {
    fields: [fitnessData.userId],
    references: [users.id],
  }),
}));
