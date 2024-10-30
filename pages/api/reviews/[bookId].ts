import dbConnect from "@/app/lib/mongodb";

export default async function handler(req, res) {
  const { bookId } = req.query;
  const { db } = await dbConnect();

  if (req.method === "GET") {
    try {
      const reviews = await db.collection("reviews").find({ bookId }).toArray();
      return res.status(200).json({ reviews });
    } catch (error) {
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
      const newReview = { bookId, user, comment, rating };
      await db.collection("reviews").insertOne(newReview);
      return res.status(201).json(newReview);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Handle other HTTP methods
  return res.status(405).json({ message: "Method Not Allowed" });
}



