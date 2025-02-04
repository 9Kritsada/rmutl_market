import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/product";
import BuyProduct from "@/models/buyProduct";
import { NextResponse } from "next/server";

// GET /api/buy/?email=test@gmail.com
export async function GET(req) {
  try {
    // เชื่อมต่อ MongoDB
    await connectMongoDB();

    // ดึง query parameter email
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // ค้นหาใน BuyProduct ด้วย email
    const buyHistory = await BuyProduct.find({ email }).sort({ createdAt: -1 });;

    // ดึงข้อมูล productIDs จากประวัติการซื้อ
    const productIDs = buyHistory.map((item) => item.productID);

    // ค้นหา Products โดยใช้ productIDs
    const products = await Product.find({ _id: { $in: productIDs } });

    // รวมข้อมูลสินค้ากับประวัติการซื้อ
    const result = buyHistory.map((buy) => {
      const product = products.find(
        (prod) => prod._id.toString() === buy.productID.toString()
      );

      return {
        ...buy._doc, // ประวัติการซื้อ
        product, // ข้อมูลสินค้า
      };
    });

    // ส่งผลลัพธ์กลับ
    return NextResponse.json({
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching buy history:", error);
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
