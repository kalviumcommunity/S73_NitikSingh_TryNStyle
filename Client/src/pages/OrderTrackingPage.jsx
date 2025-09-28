import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../components/common/Loader';
import Navbar from '../components/common/Navbar';

const OrderTrackingPage = () => {
    const { orderId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const [orderRes, trackingRes] = await Promise.all([
                    fetch(`http://localhost:8000/api/orders/${orderId}`, {
                        headers: {
                            'Authorization': `Bearer ${await user.getIdToken()}`
                        }
                    }),
                    fetch(`http://localhost:8000/api/orders/${orderId}/track`, {
                        headers: {
                            'Authorization': `Bearer ${await user.getIdToken()}`
                        }
                    })
                ]);

                const orderData = await orderRes.json();
                const trackingData = await trackingRes.json();

                if (!orderRes.ok || !trackingRes.ok) {
                    throw new Error('Failed to fetch order details');
                }

                setOrder(orderData);
                setTracking(trackingData);
            } catch (err) {
                setError('Error fetching order details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrderDetails();
        }
    }, [orderId, user]);

    const handleCancelOrder = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setOrder({ ...order, status: data.status });
                setTracking({ ...tracking, status: data.status });
            } else {
                alert(data.message || 'Failed to cancel order');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order');
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
    if (!order) return <div className="text-center mt-8">Order not found</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-500';
            case 'shipped':
                return 'bg-blue-500';
            case 'processing':
                return 'bg-yellow-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Order #{orderId}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-white ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item._id} className="flex items-center">
                                    <img
                                        src={item.product.images?.[0] || 'https://via.placeholder.com/100'}
                                        alt={item.product.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Size: {item.size} | Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        ₹{item.price * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Details */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h2>
                        <div className="text-sm text-gray-600">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                        {tracking?.trackingNumber && (
                            <p className="mt-2 text-sm">
                                Tracking Number: <span className="font-medium">{tracking.trackingNumber}</span>
                            </p>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="px-6 py-4">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Total</p>
                            <p>₹{order.amount}</p>
                        </div>
                        {(order.status === 'pending' || order.status === 'processing') && (
                            <button
                                onClick={handleCancelOrder}
                                className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => navigate('/profile')}
                    className="mt-4 text-pink-600 hover:text-pink-700"
                >
                    ← Back to Orders
                </button>
            </div>
        </div>
    );
};

export default OrderTrackingPage;