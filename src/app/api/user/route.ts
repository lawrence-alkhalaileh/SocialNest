import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const userSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, name, password } = userSchema.parse(body);

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          user: null,
          message:
            existingUser.email === email
              ? "Email already exists!"
              : "Username already exists!",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        username,
        name: name,
        password: hashedPassword,
      },
    });

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: newUser.username,
      },
      { status: 201 }
    );

    return response;
  } catch (error) {
    console.error("Error parsing request body:", error);

    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
