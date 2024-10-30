import React from 'react';

interface Book {
  id: string;
  title: string;
  cover_url: string;
  author_name: string[];
  public_rating: string;
  published_year: string;
  description: string;
  price: number;
}

const FeaturedCard: React.FC<{ book: Book }> = ({ book }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300 ease-in-out">
      <img
        src={book.cover_url}
        alt={book.title}
        className="w-full h-60 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm">{book.author_name.join(', ')}</p>
        <div className="flex items-center mt-2">
          <p className="text-gray-800 font-bold">{book.price.toFixed(2)} USD</p>
          <span className="ml-2 text-yellow-500">{book.public_rating} ★</span>
        </div>
        <p className="text-gray-500 text-sm mt-2 truncate">{book.description}</p>
      </div>
    </div>
  );
};

export default FeaturedCard;




