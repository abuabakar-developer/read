import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import BookCard from './BookCard';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import Skeleton from './Skeleton';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
}

const Bestsellers = () => {
  const [bestsellers, setBestsellers] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const response = await fetch('/api/bestsellers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Book[] = await response.json();

        // Map the data to match the Book interface, ensuring type compatibility
        const formattedData = data.map((item) => ({
          id: item.id,
          title: item.title,
          author: item.author || 'Unknown Author',
          cover_url: item.cover_url || '/default_cover.jpg',
        }));

        setBestsellers(formattedData);
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="my-12 px-4 lg:py-10 bg-white text-gray-800">
        <h2 className="text-5xl font-extrabold tracking-tighter text-left mb-6 font-serif text-gray-600 leading-tight">
          Our <span className="text-gray-600">Bestsellers</span>
        </h2>
        <div className="flex space-x-6 overflow-x-auto py-6 scrollbar-hide">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="min-w-[220px] max-w-[220px]">
              <Skeleton count={1} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (bestsellers.length === 0) {
    return <div className="text-center text-gray-600">No bestsellers found</div>;
  }

  return (
    <section className="my-12 px-4 lg:px-12 py-6 bg-white text-gray-800">
<h2 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-left mb-6 font-serif text-gray-900 leading-tight">
  Our <span className="text-gray-600">Bestsellers</span>
</h2>


      <div className="relative flex items-center justify-center mt-6">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full focus:outline-none z-10 transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-green-700"
          onClick={scrollLeft}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <div className="flex space-x-6 overflow-x-auto py-6 scrollbar-hide" ref={scrollContainerRef}>
          {bestsellers.map((book) => (
            <Link key={book.id} href={`/details/${book.id}`} passHref>
              <div className="min-w-[220px] max-w-[220px] snap-start shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 transform-gpu bg-white rounded-lg overflow-hidden">
                <BookCard book={book} />
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

export default Bestsellers;
