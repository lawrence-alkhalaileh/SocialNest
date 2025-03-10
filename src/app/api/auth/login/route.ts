import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

const userSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const JWT_SECRET = process.env.JWT_SECRET || "test";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = userSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: user.username,
      },
      { status: 200 }
    );

    response.cookies.set("token", token);

    return response;
  } catch (error) {
    console.error("Error parsing request body:", error);

    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
