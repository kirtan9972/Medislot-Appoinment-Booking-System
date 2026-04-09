import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected successfully!");
    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (error) {
    console.error("Connection failed:", error);
  }
};

testConnection();