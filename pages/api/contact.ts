// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { name, email, message } = req.body;

      // Validate the incoming data
      if (!name || !email || !message) {
         return res.status(400).json({ error: 'All fields are required.' });
      }

      // Logic to handle message (e.g., sending an email, saving to database)
      console.log(`Received contact form submission: Name: ${name}, Email: ${email}, Message: ${message}`);
      
      // Here you would typically send the email or save it to your database

      res.status(200).json({ message: 'Message sent successfully!' });
   } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
   }
}


