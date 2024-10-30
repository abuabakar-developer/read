import Image from 'next/image';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  author: string; // Added the author field for display
  cover_url: string;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="relative max-w-full sm:max-w-xs bg-white bg-opacity-80 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 overflow-hidden border border-gray-200 hover:border-gray-400">
      <Link href={`/details/${book.id}`} className="block group">
        {/* Book Cover Section */}
        <div className="h-64 relative overflow-hidden rounded-t-xl">
          <Image
            src={book.cover_url}
            alt={book.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-90"
          />
        </div>

        {/* Book Title and Author Section */}
        <div className="p-4 text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate transition-colors duration-300 group-hover:text-indigo-500">
            {book.title}
          </h3>
          <p className="text-sm sm:text-md text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
            {book.author}
          </p>
        </div>
      </Link>

      {/* "View Details" Button (Appears on Hover) */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out flex flex-col justify-end p-4">
        <div className="flex justify-center space-x-4">
          <Link href={`/details/${book.id}`}>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 text-sm font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
