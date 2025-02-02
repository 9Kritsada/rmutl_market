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

// PUT /api/user
export async function PUT(req) {
  connectMongoDB();

  try {
    const { fname, lname, faculty, email } = await req.json(); // อ่านข้อมูลจาก body ของ request
    const userId = req.nextUrl.searchParams.get("id"); // ใช้ query params สำหรับ id ผู้ใช้

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { fname, lname, faculty, email },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      data: {
        userId: updatedUser._id,
        fname: updatedUser.fname,
        lname: updatedUser.lname,
        email: updatedUser.email,
        faculty: updatedUser.faculty,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating user", error: error.message },
      { status: 500 }
    );
  }
}
