import mongoose from "mongoose";

let isConnected = false;
export const connectMongoDB = async () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState === 1;
  } catch (err) {
    console.error("Error connecting to database", err);
  }
};
