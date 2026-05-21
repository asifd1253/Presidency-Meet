import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB is connected Successfully :", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB :", error.message);
    throw error;
  }
};
