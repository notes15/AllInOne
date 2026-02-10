'use client';

import { useState, useEffect } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import Icon from '@/components/ui/AppIcon';

interface Order {
  orderId: string;
  userId: string;
  userEmail: string;
  items: Array<{ id: string; name: string; price: number; quantity?: number }>;
  total: number;
  shippingInfo: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
  };
  status: string;
  createdAt: number;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersRef = ref(rtdb, 'orders');
      const snapshot = await get(ordersRef);
      
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const ordersArray = Object.values(ordersData) as Order[];
        ordersArray.sort((a, b) => b.createdAt - a.createdAt);
        setOrders(ordersArray);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">All Orders</h2>
          <span className="text-sm text-muted-foreground">
            {orders.length} total orders
          </span>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-secondary p-6 rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Order #{order.orderId}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    ${order.total.toFixed(2)}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                    <Icon name="UserIcon" size={16} className="mr-2" />
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Name:</span> {order.shippingInfo.name}
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Email:</span> {order.userEmail}
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Address:</span>{' '}
                      {order.shippingInfo.address}
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">City:</span> {order.shippingInfo.city},{' '}
                      {order.shippingInfo.zipCode}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                    <Icon name="ShoppingBagIcon" size={16} className="mr-2" />
                    Order Items ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm bg-card p-3 rounded border border-border"
                      >
                        <span className="text-foreground">
                          {item.name} {item.quantity && `x${item.quantity}`}
                        </span>
                        <span className="font-medium text-foreground">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Icon name="ShoppingCartIcon" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}