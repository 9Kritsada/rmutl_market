import mongoose from "mongoose";
import { z } from "zod";

export const productPostZodSchema = z.object({
  name: z.string().min(3).max(255),
  price: z.number().min(0),
  image: z.string().url(),
  description: z.string().min(3).max(255),
  type: z.enum(["Book", "drink"]),
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
