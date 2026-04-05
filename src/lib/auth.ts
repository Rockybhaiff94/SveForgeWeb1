import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import bcrypt from "bcrypt";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
    adapter: DrizzleAdapter(db) as any,
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
                            });
                        }
                    } else {
                        const baseUsername = profile?.name?.replace(/\s+/g, '').toLowerCase() || email.split('@')[0];
                        let username = baseUsername;
                        let counter = 1;
                        
                        let usernameTaken = await db.query.users.findFirst({ where: eq(users.username, username) });
                        while (usernameTaken) {
                            username = `${baseUsername}${counter}`;
                            counter++;
                            usernameTaken = await db.query.users.findFirst({ where: eq(users.username, username) });
                        }

                        const [newUser] = await db.insert(users).values({
                            email,
                            username,
                            avatarUrl: user.image,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        }).returning();

                        existingUser = newUser;

                        await db.insert(accounts).values({
                            userId: existingUser.id,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        });
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
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || "user";
                token.username = (user as any).username || (user as any).name;
                token.avatarUrl = (user as any).avatarUrl || user.image;
                token.provider = (user as any).provider;
                token.createdAt = (user as any).createdAt;
                token.lastLoginAt = (user as any).lastLoginAt;
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
