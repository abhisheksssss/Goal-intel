import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
    }
    return null; // Return null to indicate mock mode in dev if not set
  }

  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    return conn;
  } catch (error) {
    console.error("MongoDB connection Error:", error);
    throw error;
  }
}
