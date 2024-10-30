// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET; // Ensure you have a secret for JWT

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      // Here you can fetch user data from your database using decoded.userId
      const userData = {
        name: decoded.name,
        email: decoded.email,
        // Add other user fields as necessary
      };

      return res.status(200).json(userData);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
