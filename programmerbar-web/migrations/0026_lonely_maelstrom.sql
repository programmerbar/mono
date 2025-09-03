ALTER TABLE `tags` ADD `can_see_training` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tags` DROP COLUMN `can_see_opplearing`;