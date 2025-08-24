DROP INDEX `invitation_email_idx`;--> statement-breakpoint
CREATE INDEX `invitation_email_idx` ON `invitation` (`email`);