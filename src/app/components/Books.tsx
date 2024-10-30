// components/Books.tsx
import React, { useEffect, useState } from 'react';

interface Book {
  title: string;
  authors: string[];
  category: string;
}

const Books: React.FC<{ selectedCategory: string | null }> = ({ selectedCategory }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${selectedCategory}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );
      const data = await response.json();
      const fetchedBooks = data.items.map((item: any) => ({
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || [],
        category: selectedCategory || 'General',
      }));
      setBooks(fetchedBooks);
      setLoading(false);
    };

    if (selectedCategory) {
      fetchBooks();
    }
  }, [selectedCategory]);

  if (loading) return <p>Loading books...</p>;

  return (
    <div className="bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Books in {selectedCategory}</h2>
      <div className="grid grid-cols-2 gap-4">
        {books.map((book, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold">{book.title}</h3>
            <p>{book.authors.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;




