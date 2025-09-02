import mongoose from "mongoose";

const localUri = process.env.MONGODB_URI as string;
const connection: any = {};
export async function connectDB(uri = localUri) {
  if (connection.isConnected) {
    console.log("DB is already connected");
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("use previous connection");
      return;
    }
    await mongoose.disconnect();
  }

  console.log("Connecting to MongoDB database...");

  const db = await mongoose.connect(uri, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 60000,
    maxPoolSize: 3,
    // Buffering means mongoose will queue up operations if it gets
    // disconnected from MongoDB and send them when it reconnects.
    // With serverless, better to fail fast if not connected.
    bufferCommands: false, // Disable mongoose buffering
    dbName: "data",
    autoCreate: true,
  });
  console.log("MongoDB database connected successfully");
  connection.isConnected = db.connections[0].readyState;
}

export async function disconnectDB() {
  if (connection.isConnected) {
    if (["production", "dev"].includes(process.env.STAGE || "")) {
      console.log("Disconnecting from MongoDB database...");
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("MongoDB database not disconnected");
    }
  }
}
