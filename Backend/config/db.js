import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Successfully connected...");
  } catch (e) {
    console.error("Connection failed:", e.message);
    process.exit(1);
  }
};

export default connectDB;
