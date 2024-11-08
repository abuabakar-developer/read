
// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Bestsellers from "@/app/components/Bestsellers";
import ReviewModal from "@/app/components/ReviewModal"; 
import Footer from "@/app/components/Footer";
import StarRating from "@/app/components/StarRating";
import { FaChevronDown, FaHeart, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

export default function BookDetails() {
  const { id } = useParams() as { id: string };
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews] = useState(0);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { addToCart } = useCart();


  useEffect(() => {
    const fetchBookDetails = async (bookId: string) => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`);
        if (!response.ok) throw new Error("Error fetching book details: " + response.statusText);

        const data = await response.json();
        const mappedBookData = mapBookData(data);

        console.log(mappedBookData); // Check the console to see if the data mapping is correct
        setBook(mappedBookData);
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) throw new Error("Error fetching reviews: " + response.statusText);

        const data = await response.json();
        setReviews(data);
        calculateAverageRating(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    if (id) {
      fetchBookDetails(id);
      fetchReviews();
      loadWishlist();
    }
  }, [id]);
  

  interface Book {
    id: string;
    title: string;
    description: string;
    cover_url: string;
    author_name: string[];
    published_year: number;
    price: number;
    discounted_price: number;
    pages?: number;
  }
  type Wishlist = {
    name: string;
    books: (Book | null)[];
  };

  interface Review {
    id: string;
    content: string; // Text of the review
    author: string;
    comment: string;
    rating: number;
  }
  interface BookData {
    id: string;
    volumeInfo: {
      title: string;
      description?: string;
      imageLinks?: {
        thumbnail?: string;
      };
      authors?: string[];
      publishedDate?: string;
    };
    saleInfo?: {
      listPrice?: {
        amount: number;
      };
      pageCount?: number; 
    };
  }

  
  const mapBookData = useCallback((data: BookData): Book => ({
    id: data.id,
    title: data.volumeInfo.title,
    description: data.volumeInfo.description || "No description available.",
    cover_url: data.volumeInfo.imageLinks?.thumbnail || "default-cover-url.jpg", 
    author_name: data.volumeInfo.authors || ["Unknown Author"],    
    published_year: parseInt(data.volumeInfo.publishedDate?.split("-")[0] || "0", 10),
    price: data.saleInfo?.listPrice?.amount || 19, 
    discounted_price: data.saleInfo?.listPrice?.amount || 25, 
    pages: (data.volumeInfo as { pageCount?: number }).pageCount ?? 0, 
  }), []);  // Empty dependency array because it doesn't depend on anything
  
  // Memoize the calculateAverageRating function
  const calculateAverageRating = useCallback((reviews: Review[]) => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length ? totalRating / reviews.length : 0;
    setAverageRating(avgRating); // Assuming setAverageRating is coming from useState
  }, []);
          
  useEffect(() => {
    // Your logic that depends on calculateAverageRating and mapBookData
  }, [calculateAverageRating, mapBookData]);



  
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
                {item.name || item.name} 
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
        <div className="relative w-full h-72"> {/* Set a fixed height for the image container */}
          <Image
            src={book.cover_url}
            alt={book.title}
            layout="fill" // Fill the parent container
            objectFit="cover" // Maintain cover style
            className="transition-transform duration-300 transform group-hover:scale-105"
          />
        </div>
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




          <div className="bg-white border border-gray-200 mt-6 pt-6 px-6 pb-6 rounded-3xl shadow-xl transition duration-300 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
  {/* Star Rating and Review Section */}
  <div className="flex flex-col items-center lg:items-start mb-6">
    <p className="flex items-center justify-center lg:justify-start mb-3">
      <span className="text-yellow-400 mr-2">
        <StarRating rating={averageRating} />
      </span>
      <span className="font-semibold text-gray-900 text-xl lg:text-3xl">
        {averageRating.toFixed(1)} out of 5
      </span>
      <span className="ml-3 text-gray-500 text-sm lg:text-lg">
        ({totalReviews} reviews)
      </span>
    </p>

    {/* Write a Review Button */}
    <button
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700 text-white px-6 py-2 mt-4 rounded-full hover:from-indigo-600 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 shadow focus:outline-none focus:ring-4 focus:ring-indigo-300"
      onClick={() => setReviewModalOpen(true)}
    >
      Write a Review
    </button>
  </div>

  {/* Review Modal */}
  {isReviewModalOpen && (
    <ReviewModal
      bookId={id}
      onClose={() => setReviewModalOpen(false)}
      reviews={reviews as Review[]}
    />
  )}

  {/* Display Individual Reviews */}
  <div className="mb-6 space-y-4">
    {reviews.map((review) => (
      <div key={review.id} className="border-t border-gray-200 pt-4">
        <p className="text-gray-700">{review.comment}</p>
        <p className="text-sm text-yellow-500 font-semibold">Rating: {review.rating}</p>
      </div>
    ))}
  </div>

  {/* Price and Actions Section */}
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-t border-gray-300 pt-4 space-y-4 lg:space-y-0 lg:space-x-6">

    {/* Pricing Section */}
    <div className="text-center lg:text-left">
      <p className="text-4xl font-extrabold text-gray-900">
        ${book.discounted_price}
        <span className="line-through text-gray-400 ml-3 text-2xl">
          ${book.price}
        </span>
      </p>
    </div>

    {/* Add to Cart Button */}
    <button
      className={`w-full lg:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full transition-all transform hover:scale-105 shadow focus:outline-none focus:ring-4 focus:ring-emerald-300 ${
        isAddedToCart ? "bg-gray-400 cursor-not-allowed" : "hover:from-emerald-600 hover:to-teal-700"
      }`}
      onClick={handleAddToCart}
      disabled={isAddedToCart}
    >
      <span className="flex items-center justify-center">
        <FaShoppingCart className="mr-2" />
        {isAddedToCart ? "Added to Cart" : "Add to Cart"}
      </span>
    </button>

    {/* Add to Wishlist Button */}
    <button
      onClick={addToWishlist}
      className={`w-full lg:w-auto bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-full transition-all transform hover:scale-105 shadow focus:outline-none focus:ring-4 focus:ring-rose-300 ${
        isAddedToWishlist ? "bg-gray-400 cursor-not-allowed" : "hover:from-rose-600 hover:to-pink-700"
      }`}
      disabled={isAddedToWishlist}
    >
      <span className="flex items-center justify-center">
        <FaHeart className="mr-2" />
        {isAddedToWishlist ? "Added to Wishlist" : "Add to Wishlist"}
      </span>
    </button>
  </div>

  {/* Wishlist Message */}
  {wishlistMessage && (
    <p className="text-green-800 mt-2 text-center lg:text-left">{wishlistMessage}</p>
  )}
</div>

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
            Whether you are seeking knowledge, adventure, or simply looking for a good story to escape into, this book will not disappoint. Its compelling narrative, 
            well-crafted characters, and thought-provoking themes make it a must-read.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            From cover to cover, you will be captivated by the authors ability to blend entertainment with enlightenment. This is a journey every reader deserves to take.
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





