import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "./db";

const mongoConnection = await connectToDatabase();
const mongoDatabase = mongoConnection.connection.db;

if (!mongoDatabase) {
  throw new Error("MongoDB connection is not ready");
}

export const auth = betterAuth({
  database: mongodbAdapter(mongoDatabase),
  
  // ইমেইল এবং পাসওয়ার্ড ভিত্তিক লগিন চালু করা
  emailAndPassword: {
    enabled: true,
  },

  // আপনার প্রোজেক্টের 4-Tier RBAC-এর জন্য ইউজার রোল ডিফাইন করা
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "Patient", // ডিফল্ট রোল Patient
      },
    }
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});