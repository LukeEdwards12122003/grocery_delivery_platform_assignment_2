import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CustomerHome = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    item: '',
    quantity: 1,
    deliveryAddress: '',
  });

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
      </div>
    </div>
  );
};

export default CustomerHome;