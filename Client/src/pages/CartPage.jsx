import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const CartPage = () => {
    const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="py-8">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-md p-6 text-center">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                            <button
                                onClick={() => navigate('/products')}
                                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="divide-y divide-gray-200">
                            {cart.map((item) => (
                                <div key={`${item._id}-${item.size}`} className="p-6 flex space-x-6">
                                    <img
                                        src={item.images?.[0] || 'https://via.placeholder.com/150'}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                                <p className="text-sm text-gray-600">Size: {item.size}</p>
                                            </div>
                                            <p className="text-lg font-semibold text-pink-600">₹{item.price}</p>
                                        </div>
                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id, item.size)}
                                                className="text-sm text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-gray-50">
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <button
                                onClick={() => navigate('/checkout')}
                                className="mt-4 w-full bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                            <button
                                onClick={() => navigate('/products')}
                                className="mt-2 w-full bg-white text-pink-500 py-3 px-4 rounded-lg border border-pink-500 hover:bg-pink-50 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;