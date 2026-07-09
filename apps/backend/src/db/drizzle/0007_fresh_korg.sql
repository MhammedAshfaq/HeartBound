CREATE TABLE IF NOT EXISTS "Partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"partnerId" uuid NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "appCode" varchar(10);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Partners" ADD CONSTRAINT "Partners_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Partners" ADD CONSTRAINT "Partners_partnerId_Users_id_fk" FOREIGN KEY ("partnerId") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Partners_userId_idx" ON "Partners" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Partners_partnerId_idx" ON "Partners" ("partnerId");--> statement-breakpoint
ALTER TABLE "Users" DROP COLUMN IF EXISTS "partnerId";--> statement-breakpoint
ALTER TABLE "Users" DROP COLUMN IF EXISTS "partnerEmail";--> statement-breakpoint
ALTER TABLE "Users" DROP COLUMN IF EXISTS "partnerCode";