// pages/api/featured-books.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
  const query = 'technology'; // Modify this query as needed for your featured section
  const BASE_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

  try {
    const response = await fetch(BASE_URL);
    
    // Check for any API response errors
    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Books API');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      // Handle the case where no books are returned
      return res.status(404).json({ error: 'No books found' });
    }

    // Ensure that each book has the necessary fields, or provide fallback values
    const books = data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title || 'No Title Available',
      cover_url: item.volumeInfo.imageLinks?.thumbnail || '/placeholder.jpg',
      author_name: item.volumeInfo.authors || ['Unknown Author'],
      public_rating: item.volumeInfo.averageRating?.toString() || 'Not Available',
      published_year: item.volumeInfo.publishedDate?.split('-')[0] || 'Not Available',
      description: item.volumeInfo.description || 'No description available',
    }));

    // Send a JSON response with the books array
    res.status(200).json({ items: books });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


