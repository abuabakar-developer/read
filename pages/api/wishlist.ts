// pages/api/wishlist.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/utils/dbConnect';
import Wishlist from '@/app/models/wishlist';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const session = await getSession({ req });

  // Check if session and session.user are defined
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  
  const userId = session.user.id; // Now TypeScript recognizes `user.id`

  switch (req.method) {
    case 'GET':
      try {
        const wishlist = await Wishlist.findOne({ userId });
        return res.status(200).json({ bookIds: wishlist ? wishlist.bookIds : [] });
      } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch wishlist', error });
      }

    case 'POST':
      try {
        const { bookId } = req.body;
        await Wishlist.findOneAndUpdate(
          { userId },
          { $addToSet: { bookIds: bookId } },
          { upsert: true, new: true }
        );
        return res.status(200).json({ message: 'Book added to wishlist' });
      } catch (error) {
        return res.status(500).json({ message: 'Failed to add book to wishlist', error });
      }

    case 'DELETE':
      try {
        const { bookIdToRemove } = req.body;
        await Wishlist.findOneAndUpdate(
          { userId },
          { $pull: { bookIds: bookIdToRemove } },
          { new: true }
        );
        return res.status(200).json({ message: 'Book removed from wishlist' });
      } catch (error) {
        return res.status(500).json({ message: 'Failed to remove book from wishlist', error });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;

