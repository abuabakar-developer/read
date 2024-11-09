import { useEffect, useState, useMemo } from 'react';
import BookCard from './BookCard';
import Pagination from './Pagination';
import Skeleton from './Skeleton';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    imageLinks?: {
      thumbnail: string;
    };
    authors?: string[];
  };
}

interface ExploreBooksProps {
  category: string | null;
  searchTerm: string;
}

const ExploreBooks: React.FC<ExploreBooksProps> = ({ category, searchTerm }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const query = category
          ? `category=${category}`
          : searchTerm
          ? `title=${searchTerm}`
          : 'bestsellers';

        const response = await fetch(`/api/books?${query}&page=${currentPage}&limit=12`);
        const data = await response.json();

        setBooks(data.items ?? []);
        setTotalPages(Math.ceil(data.totalItems / 12));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to load books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category, searchTerm, currentPage]);

  useEffect(() => {
    const exploreBooksSection = document.getElementById('explore-books');
    if (exploreBooksSection) {
      exploreBooksSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  const cachedBooks = useMemo(() => books, [books]);

  if (loading) {
    return (
      <section className="my-12 px-4 lg:px-12 py-6 bg-white text-gray-800">
        <Skeleton count={12} />
      </section>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <section id="explore-books" className="my-12 px-4 lg:px-12 py-6 bg-white text-gray-800">
      <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-left mb-6 font-serif text-gray-900 leading-tight">
        {category ? `${category} Books 2025` : searchTerm ? `Results for "${searchTerm}"` : 'Explore Popular Books'}
      </h2>
      <p className="text-lg lg:text-xl text-gray-600 mb-6 text-left leading-relaxed">
        {category || searchTerm ? 'Discover top-rated books.' : 'Check out the most popular books right now.'}
      </p>

      {/* Horizontal scroll on smaller screens, grid on larger screens */}
      <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-3 lg:grid-cols-5">
        {cachedBooks.length > 0 ? (
          cachedBooks.map((book) => (
            <div key={book.id} className="min-w-[220px] max-w-[220px] group relative transform transition-transform duration-300 hover:scale-105 rounded-lg overflow-hidden">
              <BookCard
                book={{
                  id: book.id,
                  title: book.volumeInfo.title,
                  cover_url: book.volumeInfo.imageLinks?.thumbnail || '/default-book-cover.jpg',
                  author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
                }}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No books found.</p>
        )}
      </div>

      <div className="flex justify-center mt-12">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </section>
  );
};

export default ExploreBooks;

 



