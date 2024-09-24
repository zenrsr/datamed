import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

// console.log("url: ", process.env.DATABASE_URL);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
