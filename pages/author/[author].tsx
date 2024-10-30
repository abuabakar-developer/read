'use client'; // Mark this file as a Client Component

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CheckoutButton from "@/app/components/CheckoutButton";
import FeaturedBooks from "@/app/components/FeaturedBooks"; // Import FeaturedBooks

interface Book {
  id: string;
  title: string;
  cover_url: string;
  price: number;
}

export default function AuthorDetails() {
  const { author } = useParams(); // Get the dynamic route parameter
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (author) {
      fetchBooksByAuthor(author);
    }
  }, [author]);

  const fetchBooksByAuthor = async (authorName: string) => {
    try {
      const res = await fetch(`/api/books?author=${encodeURIComponent(authorName)}`);
      if (res.ok) {
        const data = await res.json();
        const booksInfo = data.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          cover_url: item.volumeInfo.imageLinks?.thumbnail || "/default-book-cover.jpg",
          price: 29.99, // Default price; you can adjust it based on actual data
        }));
        setBooks(booksInfo);
      } else {
        console.error("Error fetching books by author:", res.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch books by author:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-gray-700">No Books Found</h1>
        <p className="text-gray-500">No books were found for the author "{author}".</p>
      </div>
    );
  }

  // Convert books into cart item format
  const cartItems = books.map(book => ({
    name: book.title,
    image: book.cover_url,
    price: book.price,
    quantity: 1, // Default quantity to 1
  }));

  return (
    <div className="container mx-auto p-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-center">
        Books by {author}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {books.map((book) => (
          <div key={book.id} className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-900">{book.title}</h2>
              <p className="text-lg text-green-700">Price: ${book.price}</p>
              <CheckoutButton cartItems={[{ ...book, quantity: 1 }]} /> {/* Add to Cart button */}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8">
        <FeaturedBooks />
      </div>
    </div>
  );
}




