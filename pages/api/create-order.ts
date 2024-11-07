import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import Stripe from 'stripe'; // Import Stripe using ES module syntax

const MONGO_URL = process.env.MONGO_URL!;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!; // Extract the Stripe secret key

const client = new MongoClient(MONGO_URL);
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' }); // Update to the expected API version
 // Initialize Stripe with the API version

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { session_id, cartItems } = req.body;

    try {
      // Fetch session details from Stripe
      const session = await stripe.checkout.sessions.retrieve(session_id);

      // Connect to MongoDB
      await client.connect();
      const db = client.db('bookstore');
      const ordersCollection = db.collection('orders');

      // Insert order into database
      const newOrder = {
        userId: session.customer,
        cartItems: cartItems,
        totalAmount: (session.amount_total ?? 0) / 100, // Default to 0 if null
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


