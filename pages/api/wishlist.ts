// pages/api/wishlist.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/lib/mongodb';
import Wishlist from '@/app/models/wishlist';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = session.user.id; // Adjust based on how you're storing user ID in session

  switch (req.method) {
    case 'GET':
      const wishlist = await Wishlist.findOne({ userId });
      return res.status(200).json({ bookIds: wishlist ? wishlist.bookIds : [] });

    case 'POST':
      // Add a book to the wishlist
      const { bookId } = req.body;
      await Wishlist.findOneAndUpdate(
        { userId },
        { $addToSet: { bookIds: bookId } }, // Add bookId if it doesn't exist
        { upsert: true, new: true }
      );
      return res.status(200).json({ message: 'Book added to wishlist' });

    case 'DELETE':
      // Remove a book from the wishlist
      const { bookIdToRemove } = req.body;
      await Wishlist.findOneAndUpdate(
        { userId },
        { $pull: { bookIds: bookIdToRemove } }, // Remove bookId
        { new: true }
      );
      return res.status(200).json({ message: 'Book removed from wishlist' });

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;

