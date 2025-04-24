CREATE TABLE `claimed_credits` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`product_id` text NOT NULL,
	`product_name` text NOT NULL,
	`product_type` text,
	`credit_cost` integer NOT NULL,
	`claimed_at` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
