'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface Book {
  id: string;
  cover_url: string;
  title: string;
  author_name: string[];
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(storedWishlist);
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const scrollAmount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: 0,
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleWheelScroll = (e: WheelEvent) => {
      if (scrollRef.current) {
        // Prevent vertical scrolling
        if (e.deltaY !== 0) {
          e.preventDefault();
        }

        // Allow horizontal scrolling only
        const scrollAmount = e.deltaY > 0 ? 300 : -300;
        scrollRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });
        handleScroll();
      }
    };

    const currentScrollRef = scrollRef.current;
    currentScrollRef?.addEventListener('wheel', handleWheelScroll, { passive: false });

    return () => {
      currentScrollRef?.removeEventListener('wheel', handleWheelScroll);
    };
  }, []);

  useEffect(() => {
    handleScroll();
  }, [wishlist]);

  const removeFromWishlist = (id: string) => {
    const updatedWishlist = wishlist.filter(book => book.id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto text-center py-10">
        <h1 className="text-3xl font-bold text-gray-700">Your Wishlist is Empty</h1>
        <p className="text-gray-500">Add some books to your wishlist!</p>
        <Link href="/">
          <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
            Browse Books
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 relative h-screen overflow-hidden">
      <h1 className="text-5xl font-bold pt-16 mt-16 text-gray-800 mb-2 sticky top-0 bg-white z-10">
        My Wishlist
      </h1>

      <h2 className="text-xl text-gray-600 mb-6">
        {wishlist.length} {wishlist.length === 1 ? 'book' : 'books'} found in your wishlist
      </h2>

      {showLeftScroll && (
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 hover:bg-gray-200 transition duration-300"
          onClick={() => scroll('left')}
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>
      )}
      {showRightScroll && (
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 hover:bg-gray-200 transition duration-300"
          onClick={() => scroll('right')}
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide h-full"
        onScroll={handleScroll}
      >
        {wishlist.map((book) => (
          <div
            key={book.id}
            className="flex-none w-72 border border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300 bg-white"
          >
            <Image
              src={book.cover_url}
              alt={book.title}
              width={500}
              height={300}
              className="w-full h-80 object-cover mb-4 rounded-lg"
            />
            <h2 className="text-xl font-semibold text-gray-800 truncate">{book.title}</h2>
            <p className="text-gray-600">{book.author_name?.join(', ') || 'Unknown Author'}</p>
            <div className="flex justify-between items-center mt-4">
              <Link href={`/book/${book.id}`}>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition duration-300 w-full">
                  View Details
                </button>
              </Link>
              <button
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                onClick={() => removeFromWishlist(book.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}








