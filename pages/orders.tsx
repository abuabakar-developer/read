// pages/orders.tsx
import { useEffect, useState } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/get-orders');
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      <ul className="space-y-4">
        {orders.map(order => (
          <li key={order.id} className="border p-4 rounded shadow-sm">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total Amount:</strong> ${(order.amount_total / 100).toFixed(2)}</p>
            <ul className="mt-2">
              {order.items.map((item: any) => (
                <li key={item.id}>
                  {item.description} - Qty: {item.quantity}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;





