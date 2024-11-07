'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Define TypeScript interfaces
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  amount_total: number;
}

interface OrderDetails {
  id: string;
  amount_total: number;
  line_items: {
    data: LineItem[];
  };
}

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const session_id = searchParams?.get('session_id');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const router = useRouter();

  // Prevent scrolling on page load
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { 
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Fetch order details and save to history
  useEffect(() => {
    if (session_id) {
      const fetchAndSaveOrder = async () => {
        try {
          const response = await fetch(`/api/get-order-details?session_id=${session_id}`);
          if (!response.ok) throw new Error('Failed to fetch order details');
          
          const data: OrderDetails = await response.json();
          setOrderDetails(data);
          setOrderConfirmed(true);

          // Save order to history
          await fetch('/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, userId: 'sampleUserId' }),
          });
        } catch (error) {
          setError('Unable to load order details');
        } finally {
          setLoading(false);
        }
      };
      fetchAndSaveOrder();
    } else {
      setError('Session ID is missing');
      setLoading(false);
    }
  }, [session_id]);

  // Render loading state
  if (loading) return <p className="text-lg text-gray-700">Loading order details...</p>;

  // Render error state
  if (error) return <p className="text-red-600">{error}</p>;

  // Render success page
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="min-h-screen flex flex-col items-center justify-center mt-16 pt-16 p-4">
        <div className="bg-white shadow-lg p-8 rounded-lg max-w-3xl w-full sm:w-11/12 md:w-3/4 lg:w-full transition transform hover:scale-105">
          <h1 className="text-4xl font-bold mb-6 text-center text-green-600">Order Success!</h1>
          {orderConfirmed && (
            <p className="text-lg text-green-500 mb-4">Your order has been confirmed!</p>
          )}
          {orderDetails ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Thank you for your order!</h2>
              <div className="border-t border-gray-200 my-4" />
              <p className="text-lg mb-2"><strong>Order ID:</strong> {orderDetails.id}</p>
              <p className="text-lg mb-4"><strong>Amount Paid:</strong> ${(orderDetails.amount_total / 100).toFixed(2)}</p>
              <h3 className="text-xl font-semibold mb-2">Order Details:</h3>
              <ul className="space-y-4">
                {orderDetails.line_items?.data?.map((item: LineItem) => (
                  <li key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm transition hover:bg-gray-100">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-500"><strong>Quantity:</strong> {item.quantity}</p>
                    </div>
                    <p className="text-lg font-semibold">${(item.amount_total / 100).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex space-x-4">
                <button 
                  onClick={() => router.replace('/')} 
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Return to Home
                </button>
              </div>   
            </div>
          ) : (
            <p>Order details not available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
