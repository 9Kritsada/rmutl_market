import mongoose from "mongoose";
import { z } from "zod";

const faculties = [
  "บริหารธุรกิจและศิลปศาสตร์",
  "วิทยาศาสตร์และเทคโนโลยีการเกษตร",
  "วิศวกรรมศาสตร์",
  "ศิลปกรรมกรรมและสถาปัตยกรรมศาสตร์",
];

export const userPostZodSchema = z.object({
  fname: z.string().min(3).max(255),
  lname: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(8),
  faculty: z.enum(faculties),
});

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  faculty: { type: String, required: true },
  otp: { type: String }, // OTP field
  otpExpiration: { type: Date }, // OTP expiration time
  isActive: { type: Boolean, default: false }, // User activation status
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
