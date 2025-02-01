import bcrypt from 'bcrypt';
import { connectMongoDB } from "@/lib/mongodb";
import User, { userPostZodSchema } from "@/models/user";
import { NextResponse } from "next/server";

// GET /api/user
export async function GET(req, res) {
  connectMongoDB();

  const user = await User.find();

  return NextResponse.json({
    message: "success",
    data: user,
  });
}

// POST /api/user
export async function POST(req, res) {
  connectMongoDB();

  const body = await req.json();

  const parsedData = userPostZodSchema.safeParse(body);
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

  const { email } = parsedData.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      {
        message: "Username already exists",
      },
      {
        status: 400,
      }
    );
  }

  const newUser = await User.create(parsedData.data);
  return NextResponse.json({
    message: "success",
    data: newUser,
  });
}
