"use client";

import { useCart } from "@/app/context/CartContext";
import CheckoutButton from "@/app/components/CheckoutButton";
import Image from "next/image";

interface CartItem {
  id: string;
  title: string;
  cover_url: string;
  price: number;
}

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <p className="text-2xl text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  const cartItems = cart.map((item: CartItem) => ({
    name: item.title,
    image: item.cover_url,
    price: item.price,
    quantity: 1,
  }));

  return (
    <div className="h-full w-full flex flex-col bg-gray-100 p-6 md:max-w-xs md:fixed md:right-0 md:top-0 md:h-full shadow-xl">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Your Cart</h1>

      <div className="flex-grow overflow-y-auto mb-4 space-y-4">
        {cart.map((item: CartItem) => (
          <div
            key={item.id}
            className="flex flex-col bg-white shadow-md p-4 rounded-lg transition-transform duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={item.cover_url}
                alt={item.title}
                width={80}
                height={80}
                className="object-cover rounded-lg transform hover:scale-105 transition-all duration-200"
              />
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-800 truncate">{item.title}</h2>
                <p className="text-sm font-semibold text-green-600">${item.price.toFixed(2)}</p>
              </div>
            </div>
            <button
              className="mt-4 text-sm bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-200 w-full"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white sticky bottom-0 shadow-lg">
        <CheckoutButton cartItems={cartItems} />
      </div>
    </div>
  );
}



