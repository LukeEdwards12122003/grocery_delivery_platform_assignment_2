import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const StaffHome = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(response.data);
    } catch (error) {
      alert('Failed to load orders. Please try again.');
    }
  }, [user.token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${orderId}/status`, {
        status,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setOrders(orders.map((order) =>
        order._id === orderId
          ? { ...order, status: response.data.status }
          : order
      ));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order status.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20">
      <div className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4">Store Staff Dashboard</h1>
        <p className="mb-6">Welcome, {user.name}.</p>
        <div>
          <h2 className="text-xl font-bold mb-4">Incoming Orders</h2>
          {orders.length === 0 ? (
            <p>There are no incoming orders.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="border p-4 mb-4 rounded"
              >
                <p><strong>Customer:</strong> {order.customerId.name}</p>
                <p><strong>Email:</strong> {order.customerId.email}</p>
                <p><strong>Item:</strong> {order.item}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
                <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                <p><strong>Status:</strong></p>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  className="mt-2 p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffHome;