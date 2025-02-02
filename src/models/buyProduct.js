import mongoose from "mongoose";
import { z } from "zod";

export const buyProductPostZodSchema = z.object({
  productId: z.string(),
  email: z.string().email(),
  message: z.string().min(1).max(255),
  status: z.string()
});

const buyProductSchema = new mongoose.Schema(
  {
    productID: { type: String, required: true },
    email: { type: String, required: true},
    message: { type: String, required: true},
    status: { type: String, required: true},
  },
  { timestamps: true }
);

const BuyProduct =
  mongoose.models.BuyProduct || mongoose.model("BuyProduct", buyProductSchema);
export default BuyProduct;
