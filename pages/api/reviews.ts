import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/utils/dbConnect";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Establish MongoDB connection

  const db = mongoose.connection.db; // Get the MongoDB database instance

  // Check if the database instance is available
  if (!db) {
    return res.status(500).json({ error: "Database connection is not established." });
  }

  if (req.method === "GET") {
    const { bookId } = req.query;

    if (!bookId || Array.isArray(bookId)) {
      return res.status(400).json({ error: "Invalid bookId parameter." });
    }

    const reviews = await db.collection("reviews").find({ bookId }).toArray();
    return res.status(200).json(reviews);
  }

  if (req.method === "POST") {
    const { bookId, content, rating } = req.body;

    if (!bookId || !content || rating === undefined) {
      return res.status(400).json({ error: "bookId, content, and rating are required." });
    }

    const newReview = {
      bookId,
      content,
      author: "Anonymous", // Replace with authenticated user's name if available
      rating,
    };

    await db.collection("reviews").insertOne(newReview);
    return res.status(201).json(newReview);
  }

  return res.status(405).end(); // Method Not Allowed
}


