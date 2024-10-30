import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL!;

const client = new MongoClient(MONGO_URL);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { session_id, cartItems } = req.body;

    try {
      // Fetch session details from Stripe
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);
      const session = await stripe.checkout.sessions.retrieve(session_id);

      // Connect to MongoDB
      await client.connect();
      const db = client.db('bookstore');
      const ordersCollection = db.collection('orders');

      // Insert order into database
      const newOrder = {
        userId: session.customer,
        cartItems: cartItems,
        totalAmount: session.amount_total / 100, // Convert cents to dollars
        paymentStatus: session.payment_status,
        createdAt: new Date(),
      };

      const result = await ordersCollection.insertOne(newOrder);

      res.status(200).json({ orderId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
