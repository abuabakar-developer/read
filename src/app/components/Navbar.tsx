
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser, AiOutlineHeart, AiOutlineDown, AiOutlineClose, AiOutlineHistory, AiOutlineLogout} from 'react-icons/ai';
import AuthModal from './AuthModal'; // Ensure this path is correct
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import CartPage from '../cart/page';

interface NavbarProps {
  onSearch: (searchTerm: string) => void;
  onCategorySelect: (category: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onCategorySelect }) => {
  const router = useRouter();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasNewOrder, setHasNewOrder] = useState(false);

  const categories = [
    'Fiction',
    'Novel',
    "kids",
    'Romance',
    'Mystery',
    'Biography',
    'Art',
    'Games',
    "Children's",
    'Stationery & Gifts',
    'Science Fiction',
    "Our Favirotes",
  ];

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserName(decodedToken.name);
    }

    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistCount(storedWishlist.length);
  }, [router]);

  const closeAuthModal = () => setAuthModalOpen(false);
   
  useEffect(() => {
    const checkNewOrder = async () => {
      const response = await fetch('/api/get-order-details');
      const data = await response.json();
      setHasNewOrder(data.newOrder);
    };
    checkNewOrder();
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem('jwtToken');
    setUserName(null);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      navigateToExploreBooks();
      resetSearch();
    }
  };

  const resetSearch = () => setSearchTerm('');

  const navigateToExploreBooks = () => {
    const exploreSection = document.getElementById('explore-books');
    if (exploreSection) {
      const sectionPosition = exploreSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: sectionPosition - 140, behavior: 'smooth' });
    }
  };

  const handleViewWishlist = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      router.push('/wishlist');
    } else {
      alert('You need to be authenticated to view your wishlist.');
      setAuthModalOpen(true);
    }
  };

  const toggleAuthModal = () => setAuthModalOpen((prev) => !prev);

  const handleCategorySelect = (category: string) => {
    onCategorySelect(category);
    navigateToExploreBooks();
    setIsCategoriesOpen(false);
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev); 

  const toggleDashboard = () => setIsDashboardOpen((prev) => !prev);

  if (!isClient) return null;

  return (
    <>
             
      {/* Upper Navbar - visible on larger screens */}
      <nav className="bg-gray-50 overflow-x-hidden border-b mx-width-auto border-green-300 fixed w-full top-0 z-50 shadow-md">
        <div className="mx-width-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            
    <Link href="/" className="text-green-900 text-3xl font-bold tracking-wide ml-0 hover:text-green-500 font-cinzel lg:text-4xl">
    ABreads
    </Link>
            {/* Search Bar - visible on larger screens */}
            <form
  onSubmit={handleSearch}
  className="hidden lg:flex relative w-full max-w-lg"
>
  <div className="relative flex items-center w-full">
    {/* Search Icon on the Left */}
    <AiOutlineSearch className="absolute left-3 w-5 h-5 text-gray-400" />

    {/* Search Input Field */}
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search for books..."
      className="w-full pl-12 pr-16 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-none shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 focus:bg-white transition-all duration-300 ease-in-out hover:shadow-xl"
    />

    {/* Submit Button with Icon */}
    <button
      type="submit"
      className="absolute right-0 h-full bg-green-600 text-white px-4 flex items-center justify-center shadow hover:bg-green-500 transition-transform duration-200 transform hover:scale-105 rounded-none"
    >
      <AiOutlineSearch className="w-5 h-5" />
    </button>
  </div>
</form>

       {/* Right Icons */}
       <div className="flex items-center space-x-2">
  <button onClick={toggleCart} className="relative text-gray-900 hover:text-green-600">
    <AiOutlineShoppingCart className="text-2xl" />
    {totalItems > 0 && (
      <span className="absolute -top-2 -right-2 inline-block w-5 h-5 text-center bg-green-500 text-white rounded-full text-xs">
        {totalItems}
      </span>
    )}
  </button>

              <div className="flex items-center space-x-4 flex-row-reverse">
            {userName && (
        <button
      onClick={toggleDashboard}
      className="text-gray-900 hover:text-green-500 transition"
       >
      <p className='h-6 font-medium w-6 ml-2 mr-8 text-green-600 border-b border-green-700'>Account</p>
     </button>
      )}
      </div>
              {userName ? (
                <button onClick={handleSignOut} className="text-gray-900 hover:text-green-500 transition flex items-center">
                  <AiOutlineUser className="h-6 w-6" />
                  <span className="ml-1">Logout</span>
                </button>
              ) : (
                <button onClick={toggleAuthModal} className="text-gray-900 hover:text-green-500 transition">
                  <AiOutlineUser className="h-6 w-6" />
                </button>
              )}
              {/* Wishlist */}
              <button
       onClick={handleViewWishlist}
       className="relative py-1 px-4 group transition-colors duration-300 rounded-r-xl"
    >
       <span className="group-hover:text-green-600 text-gray-700 flex items-center relative">
       <AiOutlineHeart className="mr-1 text-2xl" /> {/* Increased icon size */}
       {wishlistCount > 0 && (
       <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
        {wishlistCount}
        </span>
       )}
          </span>
           </button>
            </div>
          </div>
        </div>
      </nav>


      <nav className="fixed w-full top-16 z-50 bg-white border-t border-gray-300 shadow-lg">
  <div className="mx-width-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-2 flex justify-between items-center">
    {/* Categories */}
    <div className="flex items-center space-x-4">
      <div className="relative lg:hidden">
        <button
          onClick={() => setIsCategoriesOpen((prev) => !prev)}
          className="py-2 px-1 rounded-lg bg-gray-100 text-gray-900 font-semibold shadow-md transition-transform duration-200 ease-in-out hover:bg-green-500 hover:text-white hover:scale-105 flex items-center"
        >
          📚 <span>All</span>
          <AiOutlineDown
            className={`ml-2 transform transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
        {/* Categories dropdown */}
        {isCategoriesOpen && (
          <div className="absolute left-0 mt-2 py-2 w-56 bg-green-50 border border-green-200 shadow-xl rounded-md z-50 transition-opacity duration-300 ease-in-out">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="block px-4 py-2 text-left text-gray-700 hover:bg-green-300 w-full transition-colors border-b"
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

{/* Categories visible on large screens */}
<div className="hidden lg:flex space-x-6">
  {categories.map((category, index) => (
    <button
      key={category}
      onClick={() => handleCategorySelect(category)}
      className={`py-2 px-4 rounded-lg bg-transparent text-gray-900 font-semibold shadow-md transition-transform duration-200 ease-in-out hover:scale-105 
        ${index !== categories.length - 1 ? 'border-r border-gray-300 hover:border-gray-500' : ''}`}
    >
      {category}
    </button>
  ))}
</div>
 </div>

{/* Search Bar - visible on smaller screens */}
<form
  onSubmit={handleSearch}
  className="lg:hidden flex relative w-full max-w-lg"
>
  <div className="relative flex items-center w-full">
    {/* Search Icon on the Left */}
    <AiOutlineSearch className="absolute left-2 mx-width-auto text-gray-400" />

    {/* Search Input Field */}
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search for books..."
      className="w-full pl-12 pr-16 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-none shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 focus:bg-white transition-all duration-300 ease-in-out hover:shadow-xl"
    />

    {/* Submit Button with Icon */}
    <button
      type="submit"
      className="absolute right-0 h-full bg-green-600 text-white px-4 flex items-center justify-center shadow hover:bg-green-500 transition-transform duration-200 transform hover:scale-105 rounded-none"
    >
      <AiOutlineSearch className="w-5 h-5" />
    </button>
  </div>
</form>
  </div>
</nav>

<aside
  className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-green-50 via-green-100 to-green-200 shadow-2xl z-50 transition-transform duration-300 ease-in-out
    ${isDashboardOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}
    `}
>
  <div className="flex flex-col p-8 space-y-4 relative">
    {/* Close Icon - Only for small screens */}
    <button
      onClick={toggleDashboard}
      className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition-transform duration-300 ease-in-out transform hover:scale-105"
      aria-label="Close Dashboard"
    >
      <AiOutlineClose className="w-7 h-7" />
    </button>

    {/* Wishlist */}
    <button 
      onClick={() => router.push('/wishlist')}
      className="flex items-center justify-start space-x-4 p-4 border-b border-gray-300 text-gray-800 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-300 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md rounded-lg"
    >
      <div className="p-2 bg-green-50 rounded-full shadow-inner">
        <AiOutlineHeart className="text-2xl text-green-600" />
      </div>
      <span className="text-lg font-semibold text-gray-800">My Wishlist</span>
    </button>

    {/* Account Settings */}
    <button 
      onClick={() => router.push('/account')}
      className="flex items-center justify-start space-x-4 p-4 border-b border-gray-300 text-gray-800 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-300 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md rounded-lg"
    >
      <div className="p-2 bg-green-50 rounded-full shadow-inner">
        <AiOutlineUser className="text-2xl text-green-600" />
      </div>
      <span className="text-lg font-semibold text-gray-800">Settings</span>
    </button>

    {/* Order History */}
    <Link href="/order-history" legacyBehavior>
      <a className="flex items-center justify-start space-x-4 p-4 border-b border-gray-300 text-gray-800 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-300 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md rounded-lg">
        <div className="p-2 bg-green-50 rounded-full shadow-inner">
          <AiOutlineHistory className="text-2xl text-green-600" />
        </div>
        <span className="text-lg font-semibold text-gray-800">Order History</span>
        {hasNewOrder && (
          <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
        )}
      </a>
    </Link>

    {/* Logout */}
    <button 
      onClick={handleSignOut}
      className="flex items-center justify-start space-x-4 p-4 border-b border-gray-300 text-gray-800 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-300 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md rounded-lg"
    >
      <div className="p-2 bg-green-50 rounded-full shadow-inner">
        <AiOutlineLogout className="text-2xl text-green-600" />
      </div>
      <span className="text-lg font-semibold text-gray-800">Logout</span>
    </button>
  </div>
</aside>
     {/* Cart Sidebar */}
     <aside
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <button onClick={toggleCart} className="absolute top-4 right-4 text-gray-700 hover:text-red-500">
            <AiOutlineClose className="w-6 h-6" />
          </button>
          <CartPage />
        </div>
      </aside>

      {isCartOpen && (
      <div
      onClick={toggleCart}
      className='inset-0 bg-black bg-opacity-50 z-40'
      />
      )
      }
        {/* Auth Modal */}
        {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          onLoginSuccess={(token, name) => {
          setUserName(name);
           localStorage.setItem('jwtToken', token); closeAuthModal();
         }}
         /> 
        )} 
       </>
     );
   };

export default Navbar;






