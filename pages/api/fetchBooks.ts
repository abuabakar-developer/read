import { NextApiRequest, NextApiResponse } from 'next';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes?q=YOUR_QUERY&key=YOUR_GOOGLE_BOOKS_API_KEY';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(GOOGLE_BOOKS_API_URL);
    const data = await response.json();

    const books = data.items?.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      coverImage: item.volumeInfo.imageLinks?.thumbnail || '',
    })) || [];

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};


