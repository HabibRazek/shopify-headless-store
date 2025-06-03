'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createTestOrder = async (paymentMethod: string) => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/test-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethod }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Test order created successfully! Order ID: ${data.order.id} | Payment: ${data.paymentMethod}`);
        fetchOrders(); // Refresh orders list
      } else {
        setMessage(`❌ Error: ${data.error} | Details: ${data.details || 'No details'}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ User ready: ${data.message}`);
      } else {
        setMessage(`❌ Error creating user: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/test-order');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        setMessage(`✅ Found ${data.count} orders for user`);
      } else {
        setMessage(`❌ Error fetching orders: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Please Login</h1>
            <p>You need to be logged in to test orders.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Orders System</CardTitle>
          <p className="text-gray-600">Test order creation and retrieval for user: {session.user.email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={createUser}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              1. Create User in Database
            </Button>
            <Button
              onClick={() => createTestOrder('cashOnDelivery')}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              2. Create Test Order (Cash on Delivery)
            </Button>
            <Button
              onClick={() => createTestOrder('bankTransfer')}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              2. Create Test Order (Bank Transfer)
            </Button>
            <Button
              onClick={fetchOrders}
              disabled={isLoading}
              variant="outline"
            >
              3. Fetch My Orders
            </Button>
          </div>

          {message && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm">{message}</p>
            </div>
          )}

          {orders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Orders ({orders.length})</h3>
              {orders.map((order: any) => (
                <Card key={order.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Order #{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">Status: {order.status}</p>
                        <p className="text-sm text-gray-600">Total: {order.total} {order.currency}</p>
                        <p className="text-sm text-gray-600">Items: {order.items?.length || 0}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
