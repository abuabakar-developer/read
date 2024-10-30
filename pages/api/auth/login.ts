// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { sign } from 'jsonwebtoken';

interface User {
  email: string;
  password: string;
  name: string; // Ensure your user object includes a name property
}

// Mock user database (for demonstration purposes)
const users: User[] = [
  { email: 'user@example.com', password: 'password123', name: 'John Doe' }, // Replace with your actual user data
];

// Replace with your actual authentication logic
const authenticateUser = (email: string, password: string): User | null => {
  return users.find(user => user.email === email && user.password === password) || null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Authenticate user
    const user = authenticateUser(email, password);

    if (user) {
      // Generate a token if the user is valid
      const token = sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Return token and user information
      return res.status(200).json({ token, user: { name: user.name, email: user.email } }); // Adjust user info accordingly
    } else {
      return res.status(401).json({ message: 'Invalid credentials' }); // Handle invalid credentials
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}



