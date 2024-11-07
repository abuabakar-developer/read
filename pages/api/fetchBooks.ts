// pages/api/fetchBooks.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Define interfaces for the expected structure of the book data
interface VolumeInfo {
  title: string;
  authors?: string[];
  imageLinks?: {
    thumbnail?: string;
  };
  averageRating?: number;
  publishedDate?: string;
  description?: string;
}

interface BookItem {
  id: string;
  volumeInfo: VolumeInfo;
}

interface ApiResponse {
  items?: BookItem[];
}

// Assign the handler function to a variable before exporting
const fetchBooksHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
  const query = 'technology'; // Modify this query as needed
  const BASE_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

  try {
    const response = await fetch(BASE_URL);

    // Check for any API response errors
    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Books API');
    }

    const data: ApiResponse = await response.json(); // Type the response

    if (!data.items || data.items.length === 0) {
      // Handle the case where no books are returned
      return res.status(404).json({ error: 'No books found' });
    }

    // Map through the items and use the defined structure
    const books = data.items.map((item) => ({
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
};

// Export the handler function
export default fetchBooksHandler;
