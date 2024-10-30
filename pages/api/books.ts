import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category, title, author } = req.query;

  // Build the query string dynamically based on available parameters
  let query = '';

  if (title) {
    query += `intitle:${encodeURIComponent(title as string)}`;  // Search by title
  }
  if (author) {
    query += (query ? '+' : '') + `inauthor:${encodeURIComponent(author as string)}`;  // Search by author
  }
  if (!query) {
    query = category ? encodeURIComponent(category as string) : 'fiction';  // Default to 'fiction'
  }

  const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`;
  
  console.log('Constructed Google Books API URL:', googleBooksUrl);  // Log the URL for debugging

  try {
    const response = await axios.get(googleBooksUrl);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error fetching books from Google Books API:', error.response?.data || error.message);
    
    const errorMessage = error.response ? error.response.data : 'Failed to fetch books';
    res.status(error.response?.status || 500).json({
      message: errorMessage,
      error: error.message,
    });
  }
}





