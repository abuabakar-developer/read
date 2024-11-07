// src/app/utils/dbConnect.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URL;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URL environment variable inside .env.local");
}

// Extend the global object with mongoose cache using let (after declaration in the global.d.ts file)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  // Logging for debug purposes
  console.log("Attempting to connect to MongoDB with URI:", MONGO_URI);

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      console.log("MongoDB connected successfully");
      return mongoose;
    }).catch((error) => {
      console.error("MongoDB connection error:", error);
      throw new Error("MongoDB connection failed");
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
 

