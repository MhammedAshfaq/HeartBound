-- Migration: 0006_mcq_answers
-- Creates the McqAnswers table with a JSONB responses column and a FK to Users

CREATE TABLE IF NOT EXISTS "McqAnswers" (
  "id"         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId"     UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "responses"  JSONB NOT NULL,
  "createdAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "McqAnswers_userId_idx" ON "McqAnswers" ("userId");
