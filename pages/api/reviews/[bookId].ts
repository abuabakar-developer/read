import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/utils/dbConnect";
import Review from "@/app/models/Review"; // Import the Review model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bookId } = req.query;

  // Ensure bookId is a string
  if (typeof bookId !== "string") {
    return res.status(400).json({ message: "Invalid bookId parameter." });
  }

  await dbConnect(); // Connect to the database

  if (req.method === "GET") {
    try {
      // Use Mongoose model to fetch reviews for the specified bookId
      const reviews = await Review.find({ bookId });
      return res.status(200).json({ reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error); // Log the error for debugging
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    const { user, comment, rating } = req.body;

    // Validate incoming data
    if (!user || !comment || rating === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      // Use Mongoose model to insert a new review
      const newReview = await Review.create({ bookId, user, comment, rating });
      return res.status(201).json(newReview);
    } catch (error) {
      console.error("Error inserting review:", error); // Log the error for debugging
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Handle other HTTP methods
  return res.status(405).json({ message: "Method Not Allowed" });
}





