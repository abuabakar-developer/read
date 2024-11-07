import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/utils/dbConnect';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const books = req.body;

    try {
      // Ensure MongoDB connection through Mongoose
      await dbConnect();

      // Access the database using Mongoose connection
      const db = mongoose.connection.db;

      if (!db) {
        return res.status(500).json({ error: 'Failed to connect to MongoDB' });
      }

      // Insert books into the database
      const result = await db.collection('books').insertMany(books);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error saving books:", error);
      res.status(500).json({ error: 'Failed to save books' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


