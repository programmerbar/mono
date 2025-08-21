CREATE TABLE `producers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_types` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`sku` text,
	`name` text NOT NULL,
	`description` text,
	`is_sold_out` integer DEFAULT false NOT NULL,
	`ordinary_price` integer NOT NULL,
	`student_price` integer NOT NULL,
	`internal_price` integer NOT NULL,
	`credits` integer,
	`volume` real,
	`alcohol_content` real,
	`variants` text,
	`producer_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`producer_id`) REFERENCES `producers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `product_product_types` (
	`product_id` text NOT NULL,
	`product_type_id` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_type_id`) REFERENCES `product_types`(`id`) ON UPDATE no action ON DELETE cascade
);
