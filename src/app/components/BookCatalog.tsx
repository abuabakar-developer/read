import { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Adjust the import path accordingly
import axios from 'axios';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Function to fetch books based on the selected category
  const fetchBooksByCategory = async (category) => {
    try {
      const response = await axios.get(`/api/books?category=${category}`);
      setBooks(response.data.items); // Assuming response.data.items contains the book data
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // Set the selected category
    fetchBooksByCategory(category); // Fetch books for the selected category
  };

  // Effect to fetch books on component mount (if needed)
  useEffect(() => {
    if (selectedCategory) {
      fetchBooksByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <div>
      <Navbar onCategorySelect={handleCategorySelect} />
      
      {/* Conditionally render the book catalog */}
      {selectedCategory ? (
        <div>
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id}>
                <h2>{book.volumeInfo.title}</h2>
                <p>{book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
              </div>
            ))
          ) : (
            <p>No books found for the selected category.</p>
          )}
        </div>
      ) : (
        <p>Please select a category to view books.</p>
      )}
    </div>
  );
};

export default BookCatalog;
