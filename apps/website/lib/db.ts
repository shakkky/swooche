import { connectDB } from "@swooche/models";

let isConnected = false;

export async function ensureDatabaseConnection() {
  if (isConnected) {
    return;
  }

  // Skip database connection during build time
  if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
    console.log("⚠️ Skipping database connection during build");
    return;
  }

  try {
    await connectDB();
    isConnected = true;
    console.log("✅ Database connected for public board");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    // Don't throw during build time
    if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
      console.log("⚠️ Continuing without database connection during build");
      return;
    }
    throw error;
  }
}
