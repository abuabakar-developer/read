

import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Establish MongoDB connection

  const db = mongoose.connection.db; // Get the MongoDB database instance

  if (req.method === "GET") {
    const { bookId } = req.query;
    const reviews = await db.collection("reviews").find({ bookId }).toArray();
    return res.status(200).json(reviews);
  }

  if (req.method === "POST") {
    const { bookId, content, rating } = req.body;
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



