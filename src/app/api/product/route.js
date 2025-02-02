import { connectMongoDB } from "@/lib/mongodb";
import Product, { productPostZodSchema } from "@/models/product";
import { NextResponse } from "next/server";

// GET /api/product
export async function GET(req, res) {
  try {
    await connectMongoDB();

    // Query to filter products where status is "กำลังขาย"
    const products = await Product.find({ status: "กำลังขาย" });

    return NextResponse.json({
      message: "success",
      data: products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: `An error occurred: ${error.message}`,
      },
      { status: 500 }
    );
  }
}

// POST /api/product
export async function POST(req, res) {
  try {
    connectMongoDB();

    const body = await req.json();

    const parsedData = productPostZodSchema.safeParse(body);
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

    const newProduct = await Product.create(parsedData.data);
    return NextResponse.json({
      message: "success",
      data: newProduct,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: `An error occurred: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
