import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  try {
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db('bookstore');
    const booksCollection = db.collection('books');

    const books = await booksCollection
      .find({ title: { $regex: q, $options: 'i' } })
      .toArray();

    res.status(200).json({ books });
    client.close();
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books from MongoDB' });
  }
}
