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
ALTER TABLE `user` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `user` ADD `is_trained` integer DEFAULT false NOT NULL;