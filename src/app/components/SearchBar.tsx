import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  searchBarRef: React.RefObject<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchBarRef }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setSearchTerm('');
    }
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="mb-8 w-full max-w-md mx-auto relative">
      <form
        id="search-bar"
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white shadow-lg rounded-full overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
      >
        {/* Search Input */}
        <input
          type="text"
          ref={searchBarRef}
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-l-full transition duration-300"
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="px-3 py-2 text-gray-600 hover:text-red-500 focus:outline-none transition-colors duration-200"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-transform duration-200 transform hover:scale-105 focus:outline-none flex items-center"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 2a9 9 0 100 18 9 9 0 000-18zm0 0l5 5m-5-5v7"
            />
          </svg>
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

