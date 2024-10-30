import { getSession } from 'next-auth/react';
import Wishlist from '@/app/models/wishlist';
import dbConnect from '@/app/lib/mongodb';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const { bookId } = req.body;
  await dbConnect();

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: session.user.id },
    { $addToSet: { books: bookId } }, // Add bookId if it doesn't already exist
    { new: true, upsert: true }
  );

  res.status(200).json(wishlist);
}
