ALTER TABLE "links" RENAME COLUMN "creacted_at" TO "created_at";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "url_idx" ON "links" USING btree ("url");