import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/product";
import { NextResponse } from "next/server";

// GET /api/product/:id
export async function GET(req, { params }) {
  connectMongoDB();
  const { id } = params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "success",
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving product", error: error.message },
      { status: 500 }
    );
  }
}
