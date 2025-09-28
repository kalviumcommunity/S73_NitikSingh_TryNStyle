import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/common/Navbar';

const CheckoutPage = () => {
    const { user } = useContext(AuthContext);
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!selectedAddress) {
            alert('Please select a delivery address');
            return;
        }

        try {
            setLoading(true);
            const res = await loadRazorpay();

            if (!res) {
                alert('Razorpay SDK failed to load');
                return;
            }

            // Create order on backend
            const response = await fetch('http://localhost:8000/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({
                    amount: cartTotal * 100, // Convert to paise
                    items: cart,
                    shippingAddress: selectedAddress
                })
            });

            const orderData = await response.json();

            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your key
                amount: orderData.amount,
                currency: "INR",
                name: "TryNStyle",
                description: "Payment for your order",
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        // Verify payment on backend
                        const verifyResponse = await fetch('http://localhost:8000/api/payment/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${await user.getIdToken()}`
                            },
                            body: JSON.stringify({
                                orderId: orderData.id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.verified) {
                            clearCart();
                            navigate('/order-success');
                        } else {
                            alert('Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Error verifying payment:', error);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.displayName,
                    email: user.email
                },
                theme: {
                    color: "#EC4899"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={`${item._id}-${item.size}`} className="flex items-center space-x-4">
                                    <img
                                        src={item.images?.[0] || 'https://via.placeholder.com/100'}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="text-lg font-semibold text-pink-600">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between">
                                    <span className="text-lg font-medium text-gray-900">Total</span>
                                    <span className="text-2xl font-semibold text-pink-600">₹{cartTotal}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                        
                        {/* Address Selection */}
                        <div className="space-y-4 mb-8">
                            {addresses.map((address) => (
                                <label
                                    key={address._id}
                                    className={`block border rounded-lg p-4 cursor-pointer ${
                                        selectedAddress === address._id
                                            ? 'border-pink-500 bg-pink-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="address"
                                        value={address._id}
                                        checked={selectedAddress === address._id}
                                        onChange={(e) => setSelectedAddress(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">{address.street}</p>
                                        <p className="text-sm text-gray-600">
                                            {address.city}, {address.state} {address.postalCode}
                                        </p>
                                        <p className="text-sm text-gray-600">{address.country}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Add New Address Button */}
                        <button
                            onClick={() => {/* Add new address logic */}}
                            className="w-full mb-6 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            + Add New Address
                        </button>

                        {/* Payment Button */}
                        <button
                            onClick={handlePayment}
                            disabled={loading || !selectedAddress}
                            className={`w-full bg-pink-500 text-white py-3 px-4 rounded-lg ${
                                loading || !selectedAddress
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-pink-600'
                            } transition-colors`}
                        >
                            {loading ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;