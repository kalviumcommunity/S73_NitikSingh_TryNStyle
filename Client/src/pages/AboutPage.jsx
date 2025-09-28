import React from 'react';
import Navbar from '../components/common/Navbar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">About TryNStyle</h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Your one-stop destination for trendy fashion and accessories.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
                  <p className="text-gray-600 mb-6">
                    Founded in 2025, TryNStyle has grown from a small startup to one of India's most loved fashion destinations. 
                    We believe that everyone deserves to look and feel their best without breaking the bank.
                  </p>
                  <p className="text-gray-600">
                    Our mission is to make fashion accessible to all by providing high-quality clothing and accessories at 
                    reasonable prices, all while maintaining excellent customer service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-pink-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <h3 className="font-medium text-gray-900">Quality First</h3>
                        <p className="text-gray-600">We never compromise on the quality of our products.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-pink-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <h3 className="font-medium text-gray-900">Customer Satisfaction</h3>
                        <p className="text-gray-600">Your happiness is our top priority.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-pink-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <h3 className="font-medium text-gray-900">Sustainability</h3>
                        <p className="text-gray-600">We're committed to reducing our environmental impact.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Team</h2>
                <p className="text-gray-600 mb-6">
                  Our diverse team of fashion enthusiasts, tech experts, and customer service professionals 
                  work together to bring you the best shopping experience possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;