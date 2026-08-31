import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CustomerHome = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    item: '',
    quantity: 1,
    deliveryAddress: '',
  });

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setOrders(response.data);
    } catch (error) {
      alert('Failed to load orders. Please try again.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/api/orders', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Order placed successfully.');

      setFormData({
        item: '',
        quantity: 1,
        deliveryAddress: '',
      });

      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20">
      <div className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
        <p className="mb-6">Welcome, {user.name}.</p>

        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">Place Grocery Order</h2>

          <select
            value={formData.item}
            onChange={(e) => setFormData({ ...formData, item: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            required
          >
            <option value="">Select Grocery Item</option>
            <option value="Milk">Milk</option>
            <option value="Bread">Bread</option>
            <option value="Eggs">Eggs</option>
            <option value="Apples">Apples</option>
            <option value="Rice">Rice</option>
          </select>

          <input
            type="number"
            placeholder="Quantity"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <input
            type="text"
            placeholder="Delivery Address"
            value={formData.deliveryAddress}
            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Place Order
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">My Orders</h2>

          {orders.length === 0 ? (
            <p>You have no orders.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="border p-4 mb-4 rounded"
              >
                <p><strong>Item:</strong> {order.item}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
                <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;