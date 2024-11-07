// pages/api/wishlist/add.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Wishlist from '@/app/models/wishlist';
import dbConnect from '@/app/utils/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { bookId } = req.body;
  await dbConnect();

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: session.user.id },
      { $addToSet: { books: bookId } }, // Add bookId if it doesn't already exist
      { new: true, upsert: true }
    );

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update wishlist', error });
  }
}


