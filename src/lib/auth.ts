import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { users, accounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "MISSING_ID",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MISSING_SECRET",
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID || "MISSING_ID",
            clientSecret: process.env.DISCORD_CLIENT_SECRET || "MISSING_SECRET",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const user = await db.query.users.findFirst({
                    where: eq(users.email, credentials.email)
                });

                if (!user) {
                    throw new Error("User not found");
                }

                if (!user.password) {
                    throw new Error("Please sign in with your connected account.");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                await db.update(users)
                    .set({ lastLoginAt: new Date() })
                    .where(eq(users.id, user.id));

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.username,
                    role: user.role,
                    username: user.username,
                    avatarUrl: user.avatarUrl,
                    provider: user.provider,
                    createdAt: user.createdAt,
                    lastLoginAt: user.lastLoginAt,
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "credentials") {
                return true;
            }

            if (account?.provider === "google" || account?.provider === "discord") {
                try {
                    const email = user.email!;

                    let existingUser = await db.query.users.findFirst({
                        where: eq(users.email, email)
                    });

                    if (existingUser) {
                        const existingAccount = await db.query.accounts.findFirst({
                            where: and(
                                eq(accounts.provider, account.provider),
                                eq(accounts.providerAccountId, account.providerAccountId)
                            )
                        });

                        if (!existingAccount) {
                            await db.insert(accounts).values({
                                userId: existingUser.id,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                accessToken: account.access_token,
                                refreshToken: account.refresh_token,
                            });
                        }
                    } else {
                        const baseUsername = user.name?.replace(/\s+/g, '').toLowerCase() || email.split('@')[0];
                        let username = baseUsername;
                        let counter = 1;
                        while (await db.query.users.findFirst({ where: eq(users.username, username) })) {
                            username = `${baseUsername}${counter}`;
                            counter++;
                        }

                        const [newUser] = await db.insert(users).values({
                            email,
                            username,
                            avatarUrl: user.image,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            isEmailVerified: true,
                        }).returning();

                        await db.insert(accounts).values({
                            userId: newUser.id,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            accessToken: account.access_token,
                            refreshToken: account.refresh_token,
                        });

                        existingUser = newUser;
                    }

                    await db.update(users)
                        .set({ lastLoginAt: new Date() })
                        .where(eq(users.id, existingUser.id));

                    return true;
                } catch (error) {
                    console.error("OAuth SignIn Error:", error);
                    return false;
                }
            }
            return false;
        },
        async jwt({ token, user, trigger, session, account }) {
            if (account && user) {
                if (account.provider !== "credentials") {
                    const dbUser = await db.query.users.findFirst({
                        where: eq(users.email, user.email!)
                    });
                    if (dbUser) {
                        token.id = dbUser.id.toString();
                        token.role = dbUser.role;
                        token.username = dbUser.username;
                        token.avatarUrl = dbUser.avatarUrl;
                        token.provider = dbUser.provider;
                        token.createdAt = dbUser.createdAt;
                        token.lastLoginAt = dbUser.lastLoginAt;
                    }
                } else {
                    const dbUser = await db.query.users.findFirst({
                        where: eq(users.id, parseInt(user.id))
                    });

                    token.id = user.id;
                    token.role = user.role;
                    token.username = user.username;
                    token.avatarUrl = user.avatarUrl;

                    if (dbUser) {
                        token.provider = dbUser.provider;
                        token.createdAt = dbUser.createdAt;
                        token.lastLoginAt = dbUser.lastLoginAt;
                    }
                }
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session };
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.username = token.username as string;
                session.user.avatarUrl = token.avatarUrl as string | null;
                session.user.provider = token.provider as string | null;
                session.user.createdAt = token.createdAt as any;
                session.user.lastLoginAt = token.lastLoginAt as any;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
};
