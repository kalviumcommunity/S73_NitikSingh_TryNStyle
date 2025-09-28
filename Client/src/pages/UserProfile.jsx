import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../components/common/Loader';
import Navbar from '../components/common/Navbar';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        preferences: {
            bodyType: '',
            preferredStyles: [],
            preferredSizes: {
                top: '',
                bottom: '',
                shoe: ''
            }
        }
    });

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false
    });

    useEffect(() => {
        if (user) {
            const fetchUserProfile = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/users/profile/${user.uid}`, {
                        headers: {
                            'Authorization': `Bearer ${await user.getIdToken()}`
                        }
                    });
                    const data = await response.json();
                    setProfile(data);
                    setFormData({
                        name: data.name,
                        phoneNumber: data.phoneNumber || '',
                        preferences: data.preferences || {
                            bodyType: '',
                            preferredStyles: [],
                            preferredSizes: {
                                top: '',
                                bottom: '',
                                shoe: ''
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error fetching profile:', error);
                } finally {
                    setLoading(false);
                }
            };

            const fetchUserOrders = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/orders`, {
                        headers: {
                            'Authorization': `Bearer ${await user.getIdToken()}`
                        }
                    });
                    const data = await response.json();
                    setOrders(data);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            };

            const loadData = async () => {
                await Promise.all([
                    fetchUserProfile(),
                    fetchUserOrders()
                ]);
            };
            loadData();
        }
    }, [user]);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const token = await user.getIdToken();
            const response = await fetch(`http://localhost:8000/api/users/addresses/${user.uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addressForm)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setProfile(prev => ({ ...prev, addresses: updatedUser.addresses }));
                setShowAddressForm(false);
                setAddressForm({
                    street: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: '',
                    isDefault: false
                });
                alert('Address added successfully!');
            } else {
                throw new Error('Failed to add address');
            }
        } catch (error) {
            console.error('Error adding address:', error);
            alert(error.message || 'Failed to add address');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const token = await user.getIdToken();
            const response = await fetch(`http://localhost:8000/api/users/addresses/${user.uid}/${addressId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setProfile(prev => ({ ...prev, addresses: updatedUser.addresses }));
                alert('Address deleted successfully!');
            } else {
                throw new Error('Failed to delete address');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            alert(error.message || 'Failed to delete address');
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        try {
            const token = await user.getIdToken();
            const response = await fetch(`http://localhost:8000/api/users/addresses/${user.uid}/${addressId}/default`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setProfile(prev => ({ ...prev, addresses: updatedUser.addresses }));
            } else {
                throw new Error('Failed to set default address');
            }
        } catch (error) {
            console.error('Error setting default address:', error);
            alert(error.message || 'Failed to set default address');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            if (!user || !user.uid) {
                throw new Error('User not authenticated');
            }

            console.log('Current user:', user.uid); // Debug log
            const token = await user.getIdToken();
            console.log('Sending request to update profile...'); // Debug log

            const response = await fetch(`http://localhost:8000/api/users/profile/${user.uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    firebaseUid: user.uid, // Add this explicitly
                    name: formData.name || user.displayName,
                    email: user.email,
                    phoneNumber: formData.phoneNumber,
                    preferences: formData.preferences || {}
                })
            });

            console.log('Response status:', response.status); // Debug log
            const responseData = await response.json();
            console.log('Response data:', responseData); // Debug log

            if (response.ok) {
                setProfile(prevProfile => ({
                    ...prevProfile,
                    ...responseData
                }));
                setEditMode(false);
                alert('Profile updated successfully!');
            } else {
                throw new Error(responseData.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.message || 'Failed to update profile. Please try again.');
        }
    };

    if (loading) return <Loader />;
    if (!user) return <div>Please login to view your profile</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-4 px-6 text-sm font-medium ${
                                    activeTab === 'profile'
                                        ? 'border-b-2 border-pink-500 text-pink-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`py-4 px-6 text-sm font-medium ${
                                    activeTab === 'orders'
                                        ? 'border-b-2 border-pink-500 text-pink-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`py-4 px-6 text-sm font-medium ${
                                    activeTab === 'addresses'
                                        ? 'border-b-2 border-pink-500 text-pink-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Addresses
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'profile' && (
                            <div>
                                {editMode ? (
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setEditMode(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-pink-500 text-white rounded-md text-sm font-medium hover:bg-pink-600"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Name:</span>
                                                    <p className="mt-1">{profile.name}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Email:</span>
                                                    <p className="mt-1">{profile.email}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Phone Number:</span>
                                                    <p className="mt-1">{profile.phoneNumber || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 space-x-4">
                                                <button
                                                    onClick={() => setEditMode(true)}
                                                    className="px-4 py-2 bg-pink-500 text-white rounded-md text-sm font-medium hover:bg-pink-600"
                                                >
                                                    Edit Profile
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Order History</h3>
                                {orders.length === 0 ? (
                                    <p className="text-gray-500">No orders found</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div
                                                key={order._id}
                                                className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 transition-colors"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            Order #{order._id}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        order.status === 'delivered'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.status === 'shipped'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : order.status === 'processing'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : order.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>

                                                <div className="mt-4 space-y-2">
                                                    {order.items && order.items.length > 0 && (
                                                        <div className="flex items-center space-x-2">
                                                            <p className="text-sm text-gray-500">
                                                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                            </p>
                                                            <div className="flex -space-x-2">
                                                                {order.items.slice(0, 3).map((item) => (
                                                                    <img
                                                                        key={item._id}
                                                                        src={item.product?.images?.[0] || 'https://via.placeholder.com/40'}
                                                                        alt={item.product?.name}
                                                                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                                                    />
                                                                ))}
                                                                {order.items.length > 3 && (
                                                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
                                                                        +{order.items.length - 3}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                Total Amount:
                                                                <span className="ml-2 text-lg">₹{order.amount}</span>
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => window.location.href = `/order/${order._id}`}
                                                            className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                                                        >
                                                            Track Order →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Saved Addresses</h3>
                                    <button
                                        onClick={() => setShowAddressForm(true)}
                                        className="px-4 py-2 bg-pink-500 text-white rounded-md text-sm font-medium hover:bg-pink-600"
                                    >
                                        Add New Address
                                    </button>
                                </div>

                                {showAddressForm && (
                                    <form onSubmit={handleAddAddress} className="mb-6 p-4 border border-gray-200 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Street</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={addressForm.street}
                                                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">City</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={addressForm.city}
                                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">State</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={addressForm.state}
                                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={addressForm.postalCode}
                                                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={addressForm.country}
                                                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="isDefault"
                                                    checked={addressForm.isDefault}
                                                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                                                    Set as default address
                                                </label>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowAddressForm(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-pink-500 text-white rounded-md text-sm font-medium hover:bg-pink-600"
                                            >
                                                Save Address
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {profile.addresses?.length === 0 ? (
                                    <p className="text-gray-500">No addresses saved</p>
                                ) : (
                                    <div className="space-y-4">
                                        {profile.addresses?.map((address) => (
                                            <div
                                                key={address._id}
                                                className="border border-gray-200 rounded-lg p-4"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {address.street}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {address.city}, {address.state} {address.postalCode}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{address.country}</p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        {!address.isDefault && (
                                                            <button
                                                                onClick={() => handleSetDefaultAddress(address._id)}
                                                                className="text-sm text-pink-600 hover:text-pink-700"
                                                            >
                                                                Set as Default
                                                            </button>
                                                        )}
                                                        {address.isDefault && (
                                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                                Default
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteAddress(address._id)}
                                                            className="text-sm text-red-600 hover:text-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;