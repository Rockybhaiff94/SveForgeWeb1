import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, password } = registerSchema.parse(body);

        // Check if email already exists
        const existingEmail = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingEmail) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
        }

        // Check if username already exists
        const existingUsername = await db.query.users.findFirst({
            where: eq(users.username, username),
        });

        if (existingUsername) {
            return NextResponse.json({ message: "User with this username already exists" }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await db.insert(users).values({
            username,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (err: unknown) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ message: (err as any).errors[0]?.message || "Validation Error" }, { status: 400 });
        }
        console.error("Registration error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
