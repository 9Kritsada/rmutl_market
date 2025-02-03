import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/product";
import { NextResponse } from "next/server";

// GET /api/user/product?email=
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email query parameter is required." },
        { status: 400 }
      );
    }

    const products = await Product.find({ email }).sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "No products found for this email." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "success",
      data: products,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `An error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}

// PUT /api/user/product
export async function PUT(req) {
  try {
    await connectMongoDB();

    const body = await req.json();
    const { productID, email, updates } = body;

    if (!productID || !email || !updates) {
      return NextResponse.json(
        { message: "productID, email, and updates are required." },
        { status: 400 }
      );
    }

    const product = await Product.findOne({ _id: productID, email });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found for the provided productID and email." },
        { status: 404 }
      );
    }

    Object.keys(updates).forEach((key) => {
      product[key] = updates[key];
    });

    await product.save();

    return NextResponse.json({
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `An error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE /api/user/product
export async function DELETE(req) {
  try {
    await connectMongoDB();

    // อ่านข้อมูลจาก request body
    const body = await req.json();
    const { productID, email } = body;

    // ตรวจสอบว่า productID และ email มีค่าหรือไม่
    if (!productID || !email) {
      return NextResponse.json(
        { message: "productID and email are required." },
        { status: 400 }
      );
    }

    // ค้นหาและลบ Product
    const product = await Product.findOneAndDelete({ _id: productID, email });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found for the provided productID and email." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product deleted successfully.",
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `An error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}
