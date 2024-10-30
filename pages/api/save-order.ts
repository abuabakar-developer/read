// pages/api/save-order.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/lib/mongodb';
import Order from '@/app/models/Orders';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await dbConnect();

    
    const { date, status, line_items, stripeSessionId, userId } = req.body;

  
    if (!date || !status || !line_items || !stripeSessionId || !userId) {
      return res.status(400).json({ message: 'Missing required order information.' });
    }

    try {
      // Create the order object
      const newOrder = new Order({
        date,  
        status, 
        stripeSessionId, 
        items: line_items.map((item: any) => ({
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
      res.status(500).json({ message: 'Failed to save order', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

