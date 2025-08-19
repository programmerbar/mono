CREATE TABLE `contact_submission` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`message` text NOT NULL,
	`submitted_at` integer NOT NULL,
	`ip_address` text
);
