CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "votes_last_7_days" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "total_views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "trending_score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_account_id" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "provider_account_id_idx" ON "accounts" USING btree ("provider_account_id");--> statement-breakpoint
CREATE INDEX "rating_average_idx" ON "servers" USING btree ("rating_average");--> statement-breakpoint
CREATE INDEX "total_ratings_idx" ON "servers" USING btree ("total_ratings");--> statement-breakpoint
CREATE INDEX "last_bump_at_idx" ON "servers" USING btree ("last_bump_at");--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "servers" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "votes_idx" ON "servers" USING btree ("votes");