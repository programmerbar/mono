CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text,
	`can_see_opplearing` integer DEFAULT false NOT NULL,
	`can_see_beer_claims` integer DEFAULT false NOT NULL,
	`can_see_event_departures` integer DEFAULT false NOT NULL,
	`can_see_referrals` integer DEFAULT false NOT NULL,
	`can_see_bongs` integer DEFAULT false NOT NULL,
	`can_manage_tag_options` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE INDEX `idx_tags_name` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `user_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tag_id` text NOT NULL,
	`assigned_by` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assigned_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_user_tags_user_id` ON `user_tags` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_user_tags_tag_id` ON `user_tags` (`tag_id`);--> statement-breakpoint
CREATE INDEX `idx_user_tags_composite` ON `user_tags` (`user_id`,`tag_id`);--> statement-breakpoint
ALTER TABLE `notification` ADD `tag_id` text REFERENCES tags(id);--> statement-breakpoint
CREATE INDEX `idx_notifications_tag_id` ON `notification` (`tag_id`);