// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { name, email, message } = req.body;
      // Logic to handle message (e.g., sending an email, saving to database)
      res.status(200).json({ message: 'Message sent successfully!' });
   } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
   }
}
