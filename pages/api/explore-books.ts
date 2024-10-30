import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
    );
    const data = await response.json();

    const books = data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ['Unknown Author'],
      coverImage: item.volumeInfo.imageLinks?.thumbnail || '/no-image.jpg',
      publishedDate: item.volumeInfo.publishedDate || 'Unknown',
      rating: item.volumeInfo.averageRating || 0,
    }));

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
}


