
// /pages/api/subscribe.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const client = await MongoClient.connect(process.env.MONGO_URL!);
    const db = client.db();

    // Check if the user is already subscribed
    const existingSubscription = await db.collection('subscriptions').findOne({ email });

    if (existingSubscription) {
      return res.status(409).json({ message: 'You are already subscribed.' });
    }
         
    // Add the new subscription
    await db.collection('subscriptions').insertOne({ email });

    client.close();

    return res.status(201).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handler;



      
                



