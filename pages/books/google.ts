import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;
  
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`);
    const data = await response.json();
    const books = data.items?.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      coverImage: item.volumeInfo.imageLinks?.thumbnail || '/default-cover.jpg',
      authors: item.volumeInfo.authors || ['Unknown'],
    }));
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books from Google Books' });
  }
}
