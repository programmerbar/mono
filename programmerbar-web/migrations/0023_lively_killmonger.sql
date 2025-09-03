ALTER TABLE `event` ADD `description` text;--> statement-breakpoint
ALTER TABLE `event` ADD `slug` text;--> statement-breakpoint
CREATE UNIQUE INDEX `event_slug_idx` ON `event` (`slug`);