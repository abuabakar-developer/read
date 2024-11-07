import React, { useEffect, useState, useRef } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import BookCard from './BookCard'; // Import the BookCard component

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks: {
      thumbnail: string;
    };
  };
}

const ComingSoon = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=coming+soon&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.items || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="my-12 px-4 lg:py-10 bg-white text-gray-800">
        <h2 className="text-5xl font-extrabold tracking-tighter text-left mb-6 font-serif text-gray-600 leading-tight">
          Coming <span className="text-gray-600">Soon</span>
        </h2>
        <div className="flex space-x-6 overflow-x-auto py-6 scrollbar-hide">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="min-w-[220px] max-w-[220px]">
              {/* Replace with Skeleton component if you have one */}
              <div className="h-64 bg-gray-300 animate-pulse rounded-lg"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <section className="my-12 px-4 lg:px-12 py-6 bg-white text-gray-800">
      <h2 className="text-5xl font-extrabold tracking-tighter text-left mb-6 font-serif text-gray-900 leading-tight">
        Exciting New Release <span className="text-gray-600">Coming Soon</span>
      </h2>

      <div className="relative flex items-center justify-center mt-6">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full focus:outline-none z-10 transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-green-700"
          onClick={scrollLeft}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <div className="flex space-x-6 overflow-x-auto py-6 scrollbar-hide" ref={scrollContainerRef}>
          {books.map((book) => (
            <Link key={book.id} href={`/details/${book.id}`}>
              <div className="min-w-[220px] max-w-[220px] snap-start shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 transform-gpu bg-white rounded-lg overflow-hidden">
                <BookCard
                  book={{
                    id: book.id,
                    title: book.volumeInfo.title,
                    author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
                    cover_url: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.png',
                  }}
                />
              </div>
            </Link>
          ))}
        </div>

        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full focus:outline-none z-10 transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-green-700"
          onClick={scrollRight}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default ComingSoon;

