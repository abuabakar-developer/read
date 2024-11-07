import type { NextApiRequest, NextApiResponse } from 'next';
import { sign } from 'jsonwebtoken';

interface User {
  email: string;
  password: string;
  name: string;
}

const users: User[] = [
  { email: 'user@example.com', password: 'password123', name: 'John Doe' },
];

const authenticateUser = (email: string, password: string): User | null => {
  return users.find(user => user.email === email && user.password === password) || null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const user = authenticateUser(email, password);

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET is not defined in environment variables' });
    }

    if (user) {
      const token = sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token, user: { name: user.name, email: user.email } });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}


