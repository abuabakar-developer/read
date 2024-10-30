import React, { createContext, useState, useContext } from 'react';

// Create Wishlist Context
const WishlistContext = createContext();

// Create a provider component
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (item) => {
    setWishlist((prev) => [...prev, item]);
  };

  const removeFromWishlist = (item) => {
    setWishlist((prev) => prev.filter((i) => i !== item));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the Wishlist Context
export const useWishlist = () => {
  return useContext(WishlistContext);
};
