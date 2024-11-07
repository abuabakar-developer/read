// pages/api/save-order.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/utils/dbConnect';
import Order from '@/app/models/Orders';

// Define the interface for the line item
interface LineItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Define the structure of the request body
interface SaveOrderRequestBody {
  date: string;
  status: string;
  line_items: LineItem[];
  stripeSessionId: string;
  userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await dbConnect();

    // Type the request body using the defined interface
    const { date, status, line_items, stripeSessionId, userId }: SaveOrderRequestBody = req.body;

    if (!date || !status || !line_items || !stripeSessionId || !userId) {
      return res.status(400).json({ message: 'Missing required order information.' });
    }

    try {
      // Create the order object
      const newOrder = new Order({
        date,
        status,
        stripeSessionId,
        items: line_items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
        })),
      });

      await newOrder.save();
      res.status(201).json({ message: 'Order saved successfully', order: newOrder });
    } catch (error) {
      console.error('Error saving order:', error);

      // Type narrowing to handle the error safely
      if (error instanceof Error) {
        res.status(500).json({ message: 'Failed to save order', error: error.message });
      } else {
        // Fallback for unknown errors
        res.status(500).json({ message: 'Failed to save order', error: 'Unknown error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



