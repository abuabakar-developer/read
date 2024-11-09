import { useEffect, useState, useRef } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import BookCard from './BookCard';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  cover_url: string;
  author_name: string[]; // Array of author names
  public_rating: string;
  published_year: string;
  description: string;
  price: number;
}

export default function FeaturedBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/featured-books');
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setBooks(data.items);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setIsLoading(false);
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

  return (
    <section id="featured" className="my-12 px-4 lg:px-12 py-6 bg-white text-gray-800">
<h2 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-left mb-6 font-serif text-gray-900 leading-tight">
  Signed $ <span className="text-gray-600">Special Editions</span>
</h2>


      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="border-t-4 border-b-4 border-blue-600 rounded-full w-12 h-12 animate-spin" />
        </div>
      ) : (
        <div className="relative flex items-center justify-center mt-6">
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full focus:outline-none z-10 transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-green-700"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          <div className="flex space-x-6 overflow-x-auto py-6 scrollbar-hide" ref={scrollContainerRef}>
            {books.map((book) => (
              <Link key={book.id} href={`/details/${book.id}`}>
                <div className="min-w-[240px] max-w-[240px] snap-start shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 transform-gpu bg-white rounded-lg overflow-hidden">
                  <BookCard
                    book={{
                      id: book.id,
                      title: book.title,
                      cover_url: book.cover_url,
                      author: book.author_name.join(', '), // Convert author_name array to a single string
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>

          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full focus:outline-none z-10 transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-green-700"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  );
}
