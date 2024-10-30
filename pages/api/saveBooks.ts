import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/app/lib/mongodb';// Ensure this points to your MongoDB connection file

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const books = req.body;

    try {
      const client = await clientPromise;
      const db = client.db('your-database-name'); // Replace with your database name

      const result = await db.collection('books').insertMany(books);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save books' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

