'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

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

const SuccessPageContent = () => {
  const searchParams = useSearchParams();
  const session_id = searchParams?.get('session_id');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { 
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (session_id) {
      const fetchAndSaveOrder = async () => {
        try {
          const response = await fetch(`/api/get-order-details?session_id=${session_id}`);
          if (!response.ok) throw new Error('Failed to fetch order details');
          
          const data: OrderDetails = await response.json();
          setOrderDetails(data);
          setOrderConfirmed(true);

          await fetch('/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, userId: 'sampleUserId' }),
          });
        } catch {
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
      fetchAndSaveOrder();
    } else {
      setLoading(false);
    }
  }, [session_id]);

  if (loading) return <p className="text-lg text-gray-700">Loading order details...</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 p-4 sm:p-8">
      <div className="bg-white shadow-lg p-6 rounded-lg max-w-md w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl transition transform hover:scale-105">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-center text-green-600">Order Success!</h1>
        {orderConfirmed && (
          <p className="text-base sm:text-lg text-green-500 mb-4 text-center">Your order has been confirmed!</p>
        )}
        {orderDetails ? (
          <div>
            <h2 className="text-lg sm:text-2xl font-semibold mb-4 text-center">Thank you for your order!</h2>
            <div className="border-t border-gray-200 my-4" />
            <p className="text-base sm:text-lg mb-2"><strong>Order ID:</strong> {orderDetails.id}</p>
            <p className="text-base sm:text-lg mb-4"><strong>Amount Paid:</strong> ${(orderDetails.amount_total / 100).toFixed(2)}</p>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Order Details:</h3>
            <ul className="space-y-3">
              {orderDetails.line_items?.data?.map((item: LineItem) => (
                <li key={item.id} className="flex justify-between items-center bg-gray-50 p-3 sm:p-4 rounded-md shadow-sm transition hover:bg-gray-100">
                  <div>
                    <p className="font-medium text-sm sm:text-base">{item.description}</p>
                    <p className="text-xs sm:text-sm text-gray-500"><strong>Quantity:</strong> {item.quantity}</p>
                  </div>
                  <p className="text-sm sm:text-lg font-semibold">${(item.amount_total / 100).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => router.replace('/')} 
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
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
  );
};

const SuccessPage = () => (
  <Suspense fallback={<p className="text-lg text-gray-700">Loading order details...</p>}>
    <SuccessPageContent />
  </Suspense>
);

export default SuccessPage;
