CREATE TABLE IF NOT EXISTS "fitness_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"date" timestamp NOT NULL,
	"step_count" integer DEFAULT 0,
	"glucose_level" real DEFAULT 0,
	"systolic_bp" real DEFAULT 0,
	"diastolic_bp" real DEFAULT 0,
	"heart_rate" real DEFAULT 0,
	"weight" real DEFAULT 0,
	"height" real DEFAULT 0,
	"sleep_hours" real DEFAULT 0,
	"body_fat_percentage" real DEFAULT 0,
	"raw_data" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"profile_photo_url" text,
	"google_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"google_access_token" text NOT NULL,
	"google_refresh_token" text NOT NULL,
	"token_expiry" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"token_updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fitness_data" ADD CONSTRAINT "fitness_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
