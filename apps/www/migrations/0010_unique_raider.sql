ALTER TABLE `session` RENAME COLUMN "expires" TO "expires_at";--> statement-breakpoint
ALTER TABLE `shift` RENAME COLUMN "start" TO "start_at";--> statement-breakpoint
ALTER TABLE `shift` RENAME COLUMN "end" TO "end_at";