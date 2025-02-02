import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/product";
import BuyProduct from "@/models/buyProduct";
import { NextResponse } from "next/server";

// GET /api/buy
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

// POST /api/buy
export async function POST(req) {
  try {
    await connectMongoDB();

    // Parse the body data
    const { productID, email, message } = await req.json();

    // Validate the data
    if (!productID || !email || !message) {
      return NextResponse.json(
        { message: "productID, email, and message are required." },
        { status: 400 }
      );
    }

    // Check if the product exists in the Product collection
    const product = await Product.findById(productID);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    // Create a new BuyProduct document
    const newBuyProduct = new BuyProduct({
      productID,
      email,
      message,
      status: "pending", // Initial status for the purchase request
      createdAt: new Date(),
    });

    // Save the new document to the database
    await newBuyProduct.save();

    return NextResponse.json({
      message: "Product purchase request successful.",
      data: newBuyProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `An error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}
