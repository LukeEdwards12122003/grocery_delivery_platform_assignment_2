import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

function DeliveryOptions() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [address, setAddress] = useState({
    streetAddress: '',
    suburb: '',
    postcode: '',
  });

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get('/api/orders', {
            headers: { Authorization: `Bearer ${user.token}` },
            });

        setOrders(response.data);
        } 
        catch (error) {
            alert('Failed to load orders. Please try again.');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user.token]);

    const deliveryOptions = [
        {
            id: 'standard',
            name: 'Standard'
        },
        {
            id: 'express',
            name: 'Express'
        }
    ];

    const handleConfirmDelivery = async () => {
        if (selectedOrders.length === 0) {
            alert('Please select at least one order.');
            return;
        }

        if (!deliveryMethod) {
            alert('Please select a delivery method.');
            return;
        }

        const cleanedAddress = {
          streetAddress: address.streetAddress.trim(),
          suburb: address.suburb.trim(),
          postcode: address.postcode.trim(),
        }
        if (
          !cleanedAddress.streetAddress ||
          !cleanedAddress.suburb ||
          !/^\d{4}$/.test(cleanedAddress.postcode)
        ) {
          alert('Enter a street address, suburb, and four-digit postcode.')
          return
        }

        try {
            await axiosInstance.patch('/api/orders/delivery-method', {
                orderIds: selectedOrders,
                deliveryMethod: deliveryMethod,
                ...cleanedAddress,
              },
              {
                headers: { Authorization: `Bearer ${user.token}` },
              },
            )
            alert('Order placed successfully.');
            navigate('/check-delivery', { state: { selectedOrders, deliveryMethod } });
        } catch (error) {
            alert(
              error.response?.data?.message ||
                'Failed to place the order. Please try again.',
            )
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-4xl mx-auto mt-20">
            <div className="bg-white p-6 shadow-md rounded">
                <h1 className="text-2xl font-bold mb-4">
                    Delivery Options
                </h1>

                <p className="mb-6">
                    Please select your preferred delivery method
                </p>

                <div className="space-y-3">
                    {orders.map(order => (
                        <div
                            key={order._id}
                            onClick={() =>
                                setSelectedOrders(prev =>
                                prev.includes(order._id)
                                    ? prev.filter(id => id !== order._id)
                                    : [...prev, order._id]
                                )
                            }
                            className={`border-2 rounded-lg p-4 cursor-pointer ${
                            selectedOrders.includes(order._id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="delivery"
                                    value={order._id}
                                    checked={selectedOrders.includes(order._id)}
                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => 
                                        setSelectedOrders(prev => 
                                            prev.includes(order._id)
                                                ? prev.filter(id => id !== order._id)
                                                : [...prev, order._id]
                                        )}
                                />
                                <div className="flex-1">
                                    <p>
                                        <strong>Item:</strong> {order.item}
                                    </p>
                                    <p>
                                        <strong>Quantity:</strong> {order.quantity}
                                    </p>
                                    <p>
                                        <strong>Delivery Method:</strong> {order.deliveryMethod || 'Not specified'}
                                    </p>
                                    {order.status !== 'Draft' && (
                                        <p>
                                            <strong>Delivery Address:</strong>{' '}
                                            {order.streetAddress && order.suburb && order.postcode
                                                ? `${order.streetAddress}, ${order.suburb}, ${order.postcode}`
                                                : order.deliveryAddress }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            <div className="mt-6 mb-6 border-t"></div>


                <div className="space-y-3">
                    {deliveryOptions.map(option => (
                    <div
                        key={option.id}
                        onClick={() => setDeliveryMethod(option.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer ${
                        deliveryMethod === option.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="delivery"
                            value={option.id}
                            checked={deliveryMethod === option.id}
                            onChange={() => setDeliveryMethod(option.id)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                            <h2 className="font-semibold">
                                {option.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {option.description}
                            </p>
                        </div>
                    </div>
                    </div>
                    ))}
                </div>

          {deliveryMethod && (
            <section className="mt-6">
              <h2 className="text-lg font-bold mb-4">Delivery Address</h2>

              <input
                type="text"
                placeholder="Street Address"
                value={address.streetAddress}
                onChange={(e) =>
                  setAddress({ ...address, streetAddress: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded"
              />

              <input
                type="text"
                placeholder="Suburb"
                value={address.suburb}
                onChange={(e) =>
                  setAddress({ ...address, suburb: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded"
              />

              <input
                type="text"
                placeholder="Postcode"
                inputMode="numeric"
                maxLength={4}
                value={address.postcode}
                onChange={(e) =>
                  setAddress({ ...address, postcode: e.target.value })
                }
                className="w-full mb-4 p-2 border rounded"
              />
            </section>
          )}

            <div className="mt-6 mb-6 border-t"></div>

                <div className="flex gap-3">
                    <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 border border-gray-600 p-2 rounded"
                    >
                    Back
                    </button>

                    <button
                    type="button"
                    onClick={handleConfirmDelivery}
                    className="w-2/3 bg-green-600 text-white p-2 rounded"
                    >
                    Confirm Delivery
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeliveryOptions;
