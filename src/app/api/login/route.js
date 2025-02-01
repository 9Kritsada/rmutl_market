import bcrypt from "bcrypt";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { z } from "zod";
import { NextResponse } from "next/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// POST /api/login
export async function POST(req, res) {
  connectMongoDB();

  const body = await req.json();

  const parsedData = loginSchema.safeParse(body);
  if (!parsedData.success) {
    return NextResponse.json(
      {
        message: parsedData.error.errors,
      },
      {
        status: 400,
      }
    );
  }

  const { email, password } = parsedData.data;

  const existingUser = await User.findOne({ email });
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!existingUser || !isPasswordValid) {
    return NextResponse.json(
      {
        message: [
          {
            message: "Invalid email or password",
          },
        ],
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json({
    message: "Login successful",
    data: {
      userId: existingUser._id,
      fname: existingUser.fname,
      lname: existingUser.lname,
      email: existingUser.email,
      faculty: existingUser.faculty,
    },
  });
}
