import { connectMongoDB } from "@/lib/mongodb";
import Product, { productPostZodSchema } from "@/models/product";
import { NextResponse } from "next/server";

// GET /api/product
export async function GET(req, res) {
  connectMongoDB();

  const product = await Product.find();

  return NextResponse.json({
    message: "success",
    data: product,
  });
}

// POST /api/product
export async function POST(req, res) {
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
}
