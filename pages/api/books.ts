import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Define a type for the expected Google Books API response
interface GoogleBooksResponse {
  items: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      publishedDate?: string;
      description?: string;
      imageLinks?: {
        thumbnail?: string;
      };
    };
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category, title, author } = req.query;

  // Utility function to safely encode URL components
  const safeEncodeURIComponent = (value: string | string[] | undefined) => {
    return Array.isArray(value) ? encodeURIComponent(value[0]) : encodeURIComponent(value as string);
  };

  // Build the query string dynamically based on available parameters
  let query = '';
  if (title) {
    query += `intitle:${safeEncodeURIComponent(title)}`;
  }
  if (author) {
    query += (query ? '+' : '') + `inauthor:${safeEncodeURIComponent(author)}`;
  }
  if (!query) {
    query = category ? safeEncodeURIComponent(category) : 'fiction';
  }

  const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`;

  try {
    const response = await axios.get<GoogleBooksResponse>(googleBooksUrl); // Specify the response type
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching books from Google Books API:', error instanceof Error ? error.message : error);
    res.status(500).json({ message: 'Failed to fetch books', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}







