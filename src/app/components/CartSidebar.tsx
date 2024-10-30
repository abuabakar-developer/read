// components/CartSidebar.tsx
import React from 'react';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ onClose }) => {
  const { cartItems, removeItem } = useCart();

  return (
    <aside className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 z-50 transition-transform transform translate-x-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-700">Your Cart</h2>
        <button onClick={onClose} aria-label="Close Cart Sidebar">
          <FaTimes className="text-2xl text-gray-600 hover:text-gray-800" />
        </button>
      </div>
      {cartItems.length > 0 ? (
        <ul className="space-y-4">
          {cartItems.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.author}</p>
                <p className="text-gray-800">${item.price.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => removeItem(item.id)} 
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
      {cartItems.length > 0 && (
        <div className="mt-6">
          <Link href="/checkout">
            <button 
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
            >
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default CartSidebar;
