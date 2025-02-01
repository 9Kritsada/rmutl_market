import bcrypt from 'bcrypt';
import { connectMongoDB } from "@/lib/mongodb";
import User, { userPostZodSchema } from "@/models/user";
import { NextResponse } from "next/server";

// POST /api/register
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

  const { email, password } = parsedData.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      {
        message: [
          {
            message: "Username already exists",
          },
        ],
      },
      {
        status: 400,
      }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  parsedData.data.password = hashedPassword;

  const newUser = await User.create(parsedData.data);
  return NextResponse.json({
    message: "success",
    data: newUser,
  });
}
