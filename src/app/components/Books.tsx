import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface VolumeInfo {
  title: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  imageLinks?: {
    thumbnail?: string;
  };
}

interface Book {
  id: string;
  volumeInfo: VolumeInfo;
}

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get<{ items: Book[] }>('/api/books');
        const fetchedBooks = response.data.items.map(item => ({
          id: item.id,
          volumeInfo: {
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            publishedDate: item.volumeInfo.publishedDate,
            description: item.volumeInfo.description,
            imageLinks: {
              thumbnail: item.volumeInfo.imageLinks?.thumbnail,
            },
          },
        }));
        setBooks(fetchedBooks);
      } catch (err) {
        setError('Failed to fetch books');
        console.error(err);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {books.map((book) => (
        <div key={book.id} className="book-card">
          <h2>{book.volumeInfo.title}</h2>
          {book.volumeInfo.authors && (
            <p>By: {book.volumeInfo.authors.join(', ')}</p>
          )}
          {book.volumeInfo.publishedDate && (
            <p>Published: {book.volumeInfo.publishedDate}</p>
          )}
          {book.volumeInfo.imageLinks?.thumbnail ? (
            <Image
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              width={128}
              height={192}
              layout="fixed"
              priority
            />
          ) : (
            <p>No image available</p>
          )}
          <p>{book.volumeInfo.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Books;
