import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

function CheckDelivery() {
    const location = useLocation();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    const selectedOrderIds = location.state?.selectedOrders ?? [];
    
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

    const selectedOrders = orders.filter(order => selectedOrderIds.includes(order._id));

    return (
        <div className="max-w-4xl mx-auto mt-20">
            <div className="bg-white p-6 shadow-md rounded">
                <h1 className="text-2xl font-bold mb-4">
                    Check Delivery
                </h1>
                {selectedOrders.map(order => (
                    <div key={order._id} className="border p-4 mb-4 rounded">
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
                            <p>
                                <strong>Delivery Address:</strong>{' '}
                                {order.streetAddress && order.suburb && order.postcode
                                    ? `${order.streetAddress}, ${order.suburb}, ${order.postcode}`
                                    : order.deliveryAddress || 'Address unavailable'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CheckDelivery;