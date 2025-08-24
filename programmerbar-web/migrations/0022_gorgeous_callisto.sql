CREATE TABLE `pending_application` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`feide_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `pending_application_email_idx` ON `pending_application` (`email`);--> statement-breakpoint
CREATE INDEX `pending_application_feide_id_idx` ON `pending_application` (`feide_id`);