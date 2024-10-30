


'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CheckoutButton from "@/app/components/CheckoutButton";
import Bestsellers from "@/app/components/Bestsellers";
import ReviewModal from "@/app/components/ReviewModal"; 
import Footer from "@/app/components/Footer";
import StarRating from "@/app/components/StarRating";
import { FaChevronDown, FaChevronUp, FaHeart, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";

interface Book {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  author_name: string[];
  published_year: string;
  price: number;
  discounted_price: number;
  pages: number;
}


export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchBookDetails(id);
      fetchReviews();
      loadWishlist();
    }
  }, [id]);

  const fetchBookDetails = async (bookId) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`);
      if (!response.ok) throw new Error("Error fetching book details: " + response.statusText);
      const data = await response.json();
      setBook(mapBookData(data));
    } catch (error) {
      console.error("Failed to fetch book details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapBookData = (data) => ({
    id: data.id,
    title: data.volumeInfo.title,
    description: data.volumeInfo.description || "No description available.",
    cover_url: data.volumeInfo.imageLinks?.thumbnail || "/default-book-cover.jpg",
    author_name: data.volumeInfo.authors || ["Unknown Author"],
    published_year: data.volumeInfo.publishedDate || "Unknown Year",
    price: 29.99, 
    discounted_price: 19.99, 
    pages: data.volumeInfo.pageCount || "Unknown", 
  });

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?bookId=${id}`);
      if (!response.ok) throw new Error("Error fetching reviews: " + response.statusText);
      const data = await response.json();
      setReviews(data);
      calculateAverageRating(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const calculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length ? totalRating / reviews.length : 0;
    setAverageRating(avgRating);
    setTotalReviews(reviews.length);
  };
          
  
  const loadWishlist = () => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(storedWishlist);
  };

  const addToWishlist = () => {
    const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!existingWishlist.includes(book?.id)) {
      existingWishlist.push(book);
      localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
      setWishlist(existingWishlist);
      setIsAddedToWishlist(true);
      setWishlistMessage("Book added to wishlist!");

      setTimeout(() => {
        setWishlistMessage("");
      }, 3000);
    } else {
      setWishlistMessage("Book is already in your wishlist.");
    }
  };

  const toggleWishlistDropdown = () => {
    setShowWishlistDropdown(!showWishlistDropdown);
  };

  const handleCreateNewList = () => {
    if (newWishlistName) {
      const newList = { name: newWishlistName, books: [book] };
      const updatedWishlist = [...wishlist, newList];
      setWishlist(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setNewWishlistName("");
    }
  };

  const toggleSynopsis = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-gray-700">Book Not Found</h1>
        <p className="text-gray-500">The book you are looking for might not exist.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (book) {
      addToCart({
        id: book.id,
        title: book.title,
        price: book.discounted_price,
        cover_url: book.cover_url,
        quantity: 1,
      });
      setIsAddedToCart(true);
    }
  };

  return (
         
    <div className="container mx-auto p-6 md:p-10 bg-white rounded-lg shadow-lg relative">
    {/* Wishlist Dropdown */}
    <div className="relative mb-4">
      <button 
        onClick={toggleWishlistDropdown} 
        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition duration-200"
      >
        Wishlist <FaChevronDown className="inline-block ml-2" />
      </button>
      {showWishlistDropdown && (
        <div className="absolute mt-2 bg-white shadow-lg rounded-lg p-4 w-64 z-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">My Wishlist</h3>
          <ul className="mb-4">
            {wishlist.map((item, index) => (
              <li key={index} className="text-gray-600 mb-2">
                {item.title || item.name} {/* Showing book title or list name */}
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newWishlistName}
            onChange={(e) => setNewWishlistName(e.target.value)}
            placeholder="Create New List"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <button
            onClick={handleCreateNewList}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200 w-full"
          >
            Add to Wishlist
          </button>
        </div>
      )}

    </div>
      {/* Book Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Book Image */}
        <div className="lg:col-span-1 flex justify-center mb-6 lg:mb-0">
          <div className="relative group w-[80%] lg:w-[90%] bg-gray-100 rounded-lg shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
            />
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-800 hover:text-blue-500 transition duration-300">
            {book.title}
          </h1>
          <p className="text-lg text-gray-600 flex justify-center lg:justify-start items-center">
            <span className="mr-2">{book.author_name.join(", ")}</span>
            <span className="font-medium text-green-500">(Author)</span>
          </p>
                   {/* New Book Info: Pages and Published Date */}
            <p className="text-lg text-gray-600 flex justify-center lg:justify-start items-center">
            <span className="mr-2">{book.pages} pages</span>
            <span className="font-medium text-green-500">(Pages)</span>
          </p>
          <p className="text-lg text-gray-600 flex justify-center lg:justify-start items-center">
            <span className="mr-2">{book.published_year}</span>
            <span className="font-medium text-green-500">(Published Date)</span>
          </p>
         
          {/* Book Description */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Book Description:</h2>
            <p className="text-gray-600 italic">
              {book.description !== "No description available." ? (
                <>
                  {isOpen ? book.description : `${book.description.slice(0, 200)}...`}
                  <button
                    onClick={toggleSynopsis}
                    className="ml-2 text-green-700 underline hover:text-green-600"
                  >
                    {isOpen ? "Show Less" : "Show More"}
                  </button>
                </>
              ) : (
                <span>No description available for this book.</span>
              )}
            </p>
          </div>



       <div className="bg-white border border-gray-200 mt-6 pt-6 px-6 pb-4 rounded-3xl shadow-2xl transition duration-300 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
  {/* Star Rating Section */}
  <p className="flex items-center justify-center lg:justify-start mb-4">
    <span className="text-yellow-400 mr-2">
      <StarRating rating={averageRating} />
    </span>
    <span className="font-semibold text-gray-900 text-xl lg:text-3xl">{averageRating.toFixed(1)} out of 5</span>
    <span className="ml-3 text-gray-500 text-sm lg:text-lg">({totalReviews} reviews)</span>
  </p>

  {/* Write a Review Button */}
  <button
    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700 text-white px-6 py-3 mt-6 rounded-full hover:from-indigo-600 hover:to-purple-800 transform hover:scale-110 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
    onClick={() => setReviewModalOpen(true)}
  >
    Write a Review
  </button>
  
  {/* Review Modal */}
  {isReviewModalOpen && (
    <ReviewModal bookId={id} onClose={() => setReviewModalOpen(false)} />
  )}

  {/* Pricing Section */}
  <div className="flex flex-col mt-6 pt-4 border-t border-gray-300 lg:flex-row lg:items-center lg:justify-between">
    <p className="text-4xl font-extrabold text-gray-900 mb-4 lg:mb-0">
      ${book.discounted_price}
      <span className="line-through text-gray-400 ml-3 text-2xl">${book.price}</span>
    </p>
  </div>

  {/* Add to Cart Button */}
  <button
    className={`bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 mt-4 rounded-full transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-300 ${
      isAddedToCart ? "bg-gray-400 cursor-not-allowed" : "hover:from-green-500 hover:to-green-700"
    }`}
    onClick={handleAddToCart}
    disabled={isAddedToCart}
  >
    {isAddedToCart ? "Added to Cart" : "Add to Cart"}
  </button>

  {/* Add to Wishlist Button */}
  <button
    onClick={addToWishlist}
    className={`mt-6 px-6 py-3 rounded-full transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300 ${
      isAddedToWishlist ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
    } text-white`}
    disabled={isAddedToWishlist}
  >
    <FaHeart className="inline-block mr-2" /> {isAddedToWishlist ? "Added to Wishlist" : "Add to Wishlist"}
  </button>
</div>





          {wishlistMessage && (
            <p className="text-green-800 mt-2">{wishlistMessage}</p>
          )}
        </div>
      </div>




      <div className="mt-14 p-6 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-lg shadow-md border-l-4 border-green-600">
      <div className="flex items-center justify-between border border-green-600 p-4 rounded-lg cursor-pointer" onClick={toggleSynopsis}>
        <h3 className="text-xl font-semibold text-green-800">Synopsis</h3>
        {isOpen ? <FaMinus className="text-green-600" /> : <FaPlus className="text-green-600" />}
      </div>

      {isOpen && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Abreads Says:</h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            At Abreads, we believe that books hold the power to transport us to different worlds and spark imagination like nothing else.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            Whether you're seeking knowledge, adventure, or simply looking for a good story to escape into, this book will not disappoint. Its compelling narrative, 
            well-crafted characters, and thought-provoking themes make it a must-read.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            From cover to cover, you'll be captivated by the author's ability to blend entertainment with enlightenment. This is a journey every reader deserves to take.
          </p>
          <p className="text-green-700 font-medium italic">
            Grab your copy now, and let this book become part of your personal collection of literary treasures!
          </p>
        </div>
      )}
    </div>
                                   
      {/* Footer */}
      <div className="mt-10">
        <Bestsellers />
        <Footer />
      </div>
    </div>
  );
}




