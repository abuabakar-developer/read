import axios from 'axios';
import Book from '../models/Book';
import mongoose from 'mongoose';

async function fetchBooksFromGoogle(query) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

  try {
    const response = await axios.get(url);
    const books = response.data.items;

    if (books && books.length > 0) {
      const bookData = books.map((book) => {
        const volumeInfo = book.volumeInfo;
        return {
          googleId: book.id,
          title: volumeInfo.title,
          authors: volumeInfo.authors || [],
          description: volumeInfo.description,
          categories: volumeInfo.categories || [],
          thumbnail: volumeInfo.imageLinks?.thumbnail || '',
          publishedDate: volumeInfo.publishedDate,
          pageCount: volumeInfo.pageCount,
          averageRating: volumeInfo.averageRating,
          ratingsCount: volumeInfo.ratingsCount,
        };
      });

      // Save books to MongoDB
      await Book.insertMany(bookData);
      console.log('Books saved to MongoDB:', bookData.length);
    }
  } catch (error) {
    console.error('Error fetching books from Google Books API:', error);
  }
}

export default fetchBooksFromGoogle;
