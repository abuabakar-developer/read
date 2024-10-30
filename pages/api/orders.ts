import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/lib/mongodb';

interface CartItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  user: string;
  items: CartItem[];
  date: Date;
  status: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'POST') {
    try {
      const { cartItems, user } = req.body; // Cart items and user info
      const { db } = await dbConnect();

      const newOrder: Order = {
        user: user._id,
        items: cartItems,
        date: new Date(),
        status: 'pending',
      };

      const result = await db.collection('orders').insertOne(newOrder);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Failed to place order' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}



