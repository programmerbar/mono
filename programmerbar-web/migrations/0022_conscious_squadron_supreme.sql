DROP TABLE IF EXISTS `referral`;--> statement-breakpoint
DROP TABLE IF EXISTS `pending_application`;--> statement-breakpoint
CREATE TABLE `referral` (
	`id` text PRIMARY KEY NOT NULL,
	`referred_by` text NOT NULL,
	`referred` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`referred_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`referred`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pending_application` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`feide_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `pending_application_email_idx` ON `pending_application` (`email`);--> statement-breakpoint
CREATE INDEX `pending_application_feide_id_idx` ON `pending_application` (`feide_id`);--> statement-breakpoint
ALTER TABLE `user` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `user` ADD `is_trained` integer DEFAULT false NOT NULL;--> statement-breakpoint 
ALTER TABLE `user` ADD `can_refer` integer DEFAULT true NOT NULL;