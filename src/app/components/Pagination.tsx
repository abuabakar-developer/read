import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push('...');
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') onPageChange(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        className={`p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200 text-gray-700 ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <FaChevronLeft />
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {visiblePages.map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-1 text-sm rounded-md border transition-colors duration-200 ${
              page === currentPage
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            } ${page === '...' ? 'cursor-default' : ''}`}
            disabled={page === '...'}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={page === '...' ? 'Ellipsis' : `Go to page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className={`p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200 text-gray-700 ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;

