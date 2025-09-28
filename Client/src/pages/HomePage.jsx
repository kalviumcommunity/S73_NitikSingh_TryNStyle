import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiPackage, FiCreditCard, FiRefreshCw } from 'react-icons/fi';
import Navbar from '../components/common/Navbar';

const HomePage = () => {
  const features = [
    { icon: <FiTruck className="w-6 h-6" />, title: "Free Shipping", description: "On orders over ₹999" },
    { icon: <FiPackage className="w-6 h-6" />, title: "Easy Returns", description: "7 days return policy" },
    { icon: <FiCreditCard className="w-6 h-6" />, title: "Secure Payments", description: "100% secure checkout" },
    { icon: <FiRefreshCw className="w-6 h-6" />, title: "24/7 Support", description: "Dedicated support team" },
  ];

  const categories = [
    { name: "Men's Fashion", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80", path: "/products?category=men" },
    { name: "Women's Fashion", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=500&q=80", path: "/products?category=women" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80", path: "/products?category=accessories" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <div className="relative h-[600px] bg-gradient-to-r from-pink-100 to-pink-50">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Your Style
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Explore our curated collection of trendy fashion and accessories.
              Find your perfect look today.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
            >
              Shop Now
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-pink-50 rounded-lg">
                <div className="text-pink-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className="group relative h-64 overflow-hidden rounded-lg"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-2xl font-semibold text-white">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-pink-100 mb-8">
            Get updates about new products and special offers
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-pink-800 text-white rounded-md hover:bg-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;