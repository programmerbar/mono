PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`feide_id` text,
	`role` text DEFAULT 'normal' NOT NULL,
	`additional_beers` integer DEFAULT 0 NOT NULL,
	`alt_email` text DEFAULT ''
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "email", "feide_id", "role", "additional_beers", "alt_email") SELECT "id", "name", "email", "feide_id", "role", "additional_beers", "alt_email" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `feide_id_idx` ON `user` (`feide_id`);