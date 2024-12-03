PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_shift` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`start` integer NOT NULL,
	`end` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_shift`("id", "event_id", "start", "end") SELECT "id", "event_id", "start", "end" FROM `shift`;--> statement-breakpoint
DROP TABLE `shift`;--> statement-breakpoint
ALTER TABLE `__new_shift` RENAME TO `shift`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_user_shift` (
	`user_id` text NOT NULL,
	`shift_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`is_beer_claimed` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`shift_id`) REFERENCES `shift`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_shift`("user_id", "shift_id", "created_at", "updated_at", "is_beer_claimed", "status") SELECT "user_id", "shift_id", "created_at", "updated_at", "is_beer_claimed", "status" FROM `user_shift`;--> statement-breakpoint
DROP TABLE `user_shift`;--> statement-breakpoint
ALTER TABLE `__new_user_shift` RENAME TO `user_shift`;