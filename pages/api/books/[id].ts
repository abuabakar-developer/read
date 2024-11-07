import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Book ID is required' });
  }

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`);
    if (!response.ok) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const bookData = await response.json();

    return res.status(200).json(bookData);
  } catch (error) {
    console.error('Error fetching book data:', error); // Log the error to the server console
    return res.status(500).json({ error: 'Error fetching book data' });
  }
}




