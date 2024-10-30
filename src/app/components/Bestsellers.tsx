import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import BookCard from './BookCard';
import { Book } from '../types';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import Skeleton from './Skeleton'; // Import your Skeleton component

const Bestsellers = () => {
  const [bestsellers, setBestsellers] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const response = await fetch('/api/bestsellers');
        const data = await response.json();
        setBestsellers(data);
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

  // If loading, show skeletons
  if (loading) {
    return (
      <section className="my-12 px-4 lg:py-10 bg-white text-gray-800"> 
        <h2 className="text-5xl font-extrabold tracking-tighter text-left mb-6 font-serif text-gray-600 leading-tight">
          Our <span className="text-gray-600">Bestsellers</span>
        </h2>
        <div className="flex space-x-6 overflow-x-auto py-6 scrollbar-hide">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="min-w-[220px] max-w-[220px]">
              <Skeleton />
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
    <section className="my-12 px-4 lg:px-12 py-6 bg-white text-gray-800"> {/* Adjusted padding */}
      {/* Main Heading */}
      <h2 className="text-5xl font-extrabold tracking-tighter text-left mb-6 font-serif text-gray-900 leading-tight">
        Our <span className="text-gray-600">Bestsellers</span>
      </h2>

      {/* Scrolling book list with left/right scroll buttons */}
      <div className="relative flex items-center justify-center mt-6">
        {/* Left scroll button */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full focus:outline-none z-10 transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-green-700"
          onClick={scrollLeft}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        {/* Scrolling container */}
        <div className="flex space-x-6 overflow-x-auto py-6 scrollbar-hide" ref={scrollContainerRef}>
          {bestsellers.map((book) => (
            <Link key={book.id} href={`/details/${book.id}`}>
              <div className="min-w-[220px] max-w-[220px] snap-start shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 transform-gpu bg-white rounded-lg overflow-hidden">
                <BookCard book={book} />
              </div>
            </Link>
          ))}
        </div>

        {/* Right scroll button */}
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



