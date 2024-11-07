import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URL;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URL environment variable inside .env.local");
}

// Ensure `global.mongoose` is initialized with a proper structure
declare global {
  var mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

// Initialize the cached connection if it's not already set
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Ensure that the cached variable is properly initialized before accessing it
  if (cached && cached.conn) {
    return cached.conn;
  }

  // Logging for debugging purposes
  console.log("Attempting to connect to MongoDB with URI:", MONGO_URI);

  // Check if cached.promise is initialized
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI!).then((mongooseInstance) => {
      console.log("MongoDB connected successfully");
      return mongooseInstance.connection; // Use connection object here
    }).catch((error) => {
      console.error("MongoDB connection error:", error);
      throw new Error("MongoDB connection failed");
    });
  }

  // Await the connection and store it in cached.conn
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;



