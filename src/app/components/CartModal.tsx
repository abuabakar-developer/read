// components/CartModal.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeItem } from '../store/cartSlice';
import { RootState } from '../store/store';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity);

  if (!isOpen) return null; // Don't render if not open

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-md w-1/3">
        <h2 className="text-2xl font-bold">Your Cart ({totalQuantity})</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between items-center py-2">
                <span>{item.title} (x{item.quantity})</span>
                <span>${item.price * item.quantity}</span>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500">Remove</button>
              </li>
            ))}
          </ul>
        )}
        {cartItems.length > 0 && (
          <div className="mt-4">
            <button onClick={handleClearCart} className="bg-red-500 text-white px-4 py-2 rounded">Clear Cart</button>
          </div>
        )}
        <div className="mt-4">
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
