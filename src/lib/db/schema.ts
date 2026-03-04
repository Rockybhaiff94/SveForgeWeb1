import { pgTable, text, serial, timestamp, integer, boolean, index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").unique().notNull(),
  password: text("password"),
  avatarUrl: text("avatar_url"),
  provider: text("provider"),
  providerAccountId: text("provider_account_id"),
  bio: text("bio"),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    providerAccountIdIdx: index("provider_account_id_idx").on(table.providerAccountId),
  };
});

export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description").notNull(),
  gameType: text("game_type").notNull(),
  serverIP: text("server_ip").unique().notNull(),
  port: integer("port"),
  bannerImage: text("banner_image"),
  logoImage: text("logo_image"),
  websiteURL: text("website_url"),
  discordURL: text("discord_url"),
  tags: text("tags").array(),
  votes: integer("votes").default(0).notNull(),
  votesLast7Days: integer("votes_last_7_days").default(0).notNull(),
  totalViews: integer("total_views").default(0).notNull(),
  trendingScore: integer("trending_score").default(0).notNull(),
  ratingAverage: integer("rating_average").default(0).notNull(),
  totalRatings: integer("total_ratings").default(0).notNull(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  lastBumpAt: timestamp("last_bump_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    ratingAverageIdx: index("rating_average_idx").on(table.ratingAverage),
    totalRatingsIdx: index("total_ratings_idx").on(table.totalRatings),
    lastBumpAtIdx: index("last_bump_at_idx").on(table.lastBumpAt),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
    votesIdx: index("votes_idx").on(table.votes),
  };
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serverId: integer("server_id").references(() => servers.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serverId: integer("server_id").references(() => servers.id).notNull(),
  ratingValue: integer("rating_value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serverId: integer("server_id").references(() => servers.id).notNull(),
  reason: text("reason").notNull(),
  status: text("status", { enum: ["pending", "resolved"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
