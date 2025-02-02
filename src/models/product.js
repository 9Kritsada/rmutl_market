import mongoose from "mongoose";
import { z } from "zod";

const productType = ["หนังสือ", "อุปกรณ์เครื่องเขียน", "เครื่องมือ", "อื่นๆ"];
const productStatus = ["กำลังขาย", "สิ้นสุดการขาย", "ยกเลิกขาย"];

export const productPostZodSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().min(0),
  image: z.string().url(),
  details: z.string(),
  email: z.string().email(),
  type: z.enum(productType),
  status: z.enum(productStatus),
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    details: { type: String },
    email: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: productStatus, default: "กำลังขาย" },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
