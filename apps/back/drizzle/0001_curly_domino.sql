ALTER TABLE "inboxEntry" ADD COLUMN "createdAt" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "inboxEntry" ADD COLUMN "updatedAt" date DEFAULT now() NOT NULL;