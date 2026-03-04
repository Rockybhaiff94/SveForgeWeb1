import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            username: string;
            avatarUrl: string | null;
            provider: string | null;
            createdAt: string | Date;
            lastLoginAt: string | Date | null;
        } & DefaultSession["user"];
    }

    interface User {
        role: string;
        username: string;
        avatarUrl: string | null;
        provider: string | null;
        createdAt: string | Date;
        lastLoginAt: string | Date | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        username: string;
        avatarUrl: string | null;
        provider: string | null;
        createdAt: string | Date;
        lastLoginAt: string | Date | null;
    }
}
