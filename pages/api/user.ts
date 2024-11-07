/// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Ensure you have a secret for JWT
const secretKey = process.env.JWT_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for supported HTTP methods
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if secretKey is defined
    if (!secretKey) {
      return res.status(500).json({ message: 'Internal Server Error: Secret key not configured' });
    }

    try {
      const decoded = jwt.verify(token, secretKey) as { name: string; email: string; userId: string }; // Explicitly type the decoded token
      // Here you can fetch user data from your database using decoded.userId
      const userData = {
        name: decoded.name,
        email: decoded.email,
        // Add other user fields as necessary
      };

      return res.status(200).json(userData);
    } catch (error) {
      console.error('Error verifying token:', error); // Log the error for debugging
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}


