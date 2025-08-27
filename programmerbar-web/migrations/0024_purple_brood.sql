ALTER TABLE `tags` ADD `can_see_user_changes` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tags` ADD `can_see_event_updates` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tags` ADD `can_see_shift_updates` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tags` ADD `can_see_tag_changes` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tags` ADD `can_see_contact_submissions` integer DEFAULT false NOT NULL;