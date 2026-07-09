ALTER TABLE "Users" ADD COLUMN "theme" varchar(50) DEFAULT 'system' NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "isNotificationsEnabled" boolean DEFAULT true NOT NULL;