import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

// http://localhost:3000/api/check?email=kritsada_wi65@live.rmutl.ac.th
export async function GET(req) {
  // เชื่อมต่อ MongoDB
  await connectMongoDB();

  // ดึงค่า email จาก query string
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email parameter is required" },
      { status: 400 }
    );
  }

  try {
    // ค้นหา user โดยใช้ email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Email not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "success",
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving user", error: error.message },
      { status: 500 }
    );
  }
}
