ALTER TABLE "tag" DROP CONSTRAINT "tag_name_unique";--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_userId_name_unique" UNIQUE("userId","name");