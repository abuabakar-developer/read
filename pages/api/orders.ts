import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/utils/dbConnect';
import Order from '@/app/models/Orders';

interface CartItems {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect(); // Establish database connection

  if (method === 'POST') {
    try {
      const { cartItems, user } = req.body as { cartItems: CartItems[]; user: { _id: string } };

      // Create a new order using the Order model
      const newOrder = new Order({
        user: user._id,
        items: cartItems,
        date: new Date(),
        status: 'pending',
      });

      // Save the new order to the database
      const result = await newOrder.save();
      res.status(200).json({ message: 'Order placed successfully', order: result });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Failed to place order' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}


