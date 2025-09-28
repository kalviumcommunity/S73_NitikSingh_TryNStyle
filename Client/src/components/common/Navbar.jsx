import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { FiUser, FiShoppingCart } from 'react-icons/fi';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-pink-600">TryNStyle</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-pink-600">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-pink-600">Shop</Link>
            <Link to="/about" className="text-gray-600 hover:text-pink-600">About Us</Link>
            <Link to="/contact" className="text-gray-600 hover:text-pink-600">Contact</Link>
          </div>

          {/* Auth & Cart Links */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="text-gray-600 hover:text-pink-600">
              <FiShoppingCart className="h-6 w-6" />
            </Link>
            {user ? (
              <Link 
                to="/profile" 
                className="flex items-center text-gray-600 hover:text-pink-600"
              >
                <FiUser className="h-6 w-6" />
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
              >
                Login / Signup
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-pink-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (hidden by default) */}
        <div className="hidden md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-600 hover:text-pink-600">Home</Link>
            <Link to="/products" className="block px-3 py-2 text-gray-600 hover:text-pink-600">Shop</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-600 hover:text-pink-600">About Us</Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-600 hover:text-pink-600">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;