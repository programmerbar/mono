CREATE TABLE `invitation` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`expires` integer NOT NULL,
	`redeemed_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shift` (
	`id` text PRIMARY KEY NOT NULL,
	`start` integer NOT NULL,
	`end` integer NOT NULL,
	`event_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users_to_shifts` (
	`user_id` text NOT NULL,
	`shift_id` text NOT NULL,
	PRIMARY KEY(`shift_id`, `user_id`)
);
--> statement-breakpoint
ALTER TABLE user ADD `type` text DEFAULT 'user' NOT NULL;