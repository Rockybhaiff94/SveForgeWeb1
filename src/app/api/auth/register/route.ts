import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
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

    // Check if email or username already exists
    const existingUser = await db.query.users.findFirst({
      where: or(
        eq(users.email, email),
        eq(users.username, username)
      ),
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
      }
      return NextResponse.json({ message: "User with this username already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      role: "user"
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
