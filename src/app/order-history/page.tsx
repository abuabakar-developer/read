// src/app/order-history/page.tsx
"use client"
import { useEffect, useState } from "react";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/get-order-history");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!orders.length) return <p className="text-center text-gray-500">No orders found.</p>;

  return (
    <div className="pt-16 mt-16 max-w-3xl mx-auto px-4">
      <h1 className="pt-4 mt-4 text-3xl font-semibold text-center mb-8">Order History</h1>
      {orders.map((order) => (
        <div key={order.id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <p className="text-sm text-gray-400">Order Date: <span className="font-semibold">{new Date(order.created_at * 1000).toLocaleDateString()}</span></p>
            <p className="text-sm text-gray-400">Order ID: <span className="font-semibold">{order.id}</span></p>
          </div>
          <ul>
            {order.items && order.items.length ? (
              order.items.map((item: any) => (
                <li key={item.id} className="flex justify-between py-2 border-b last:border-none">
                  <div>
                    <p className="font-semibold">{item.description}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-green-600">Price: ${item.price}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No items found for this order.</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}





