import { NextApiRequest, NextApiResponse } from 'next';

// Define interfaces for the expected structure of the API response
interface VolumeInfo {
  title: string;
  imageLinks?: {
    thumbnail?: string;
  };
}

interface BookItem {
  id: string;
  volumeInfo: VolumeInfo;
}

interface Book {
  id: string;
  title: string;
  cover_url: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const query = 'bestsellers'; // Modify this query as needed

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&maxResults=10`
    );

    const data = await response.json();

    // Ensure that data.items is defined and is an array
    const books: Book[] = (data.items || []).map((item: BookItem) => ({
      id: item.id,
      title: item.volumeInfo.title || 'No Title Available',
      cover_url: item.volumeInfo.imageLinks?.thumbnail || '/default-cover.jpg', // Fallback to default cover
    }));

    res.status(200).json(books); // Return only necessary book data
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    res.status(500).json({ error: 'Failed to fetch bestsellers' });
  }
};

export default handler;





