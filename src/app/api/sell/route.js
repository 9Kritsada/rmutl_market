import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/product";
import BuyProduct from "@/models/buyProduct";
import { NextResponse } from "next/server";

// GET /api/sell
export async function GET(req) {
  try {
    await connectMongoDB();

    // Parse the query parameters
    const { searchParams } = new URL(req.url);
    const productID = searchParams.get("productID");

    // Validate productID
    if (!productID) {
      return NextResponse.json(
        { message: "productID query parameter is required." },
        { status: 400 }
      );
    }

    // Find BuyProduct by productID
    const buyProducts = await BuyProduct.find({ productID });

    if (!buyProducts || buyProducts.length === 0) {
      return NextResponse.json(
        { message: "No purchase records found for the provided productID." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "success",
      data: buyProducts,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `An error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}
