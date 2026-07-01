DO $$ BEGIN
 CREATE TYPE "public"."relationship_status" AS ENUM('single', 'dating', 'engaged', 'married');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "relationshipStatus" SET DATA TYPE relationship_status USING "relationshipStatus"::relationship_status;--> statement-breakpoint
ALTER TABLE "Users" DROP COLUMN IF EXISTS "nickname";