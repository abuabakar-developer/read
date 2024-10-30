import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa"; // Import a spinner icon for loading

// Initialize Stripe.js with your public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface CheckoutButtonProps {
  cartItems: {
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
}

export default function CheckoutButton({ cartItems }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { id } = await response.json();

      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId: id });
        if (error) {
          console.error("Stripe checkout error:", error.message);
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className={`w-full max-w-xs mx-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold text-lg py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-teal-300 ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <FaSpinner className="animate-spin" /> <span>Processing...</span>
        </>
      ) : (
        "Proceed to Checkout"
      )}
    </button>
  );
}


