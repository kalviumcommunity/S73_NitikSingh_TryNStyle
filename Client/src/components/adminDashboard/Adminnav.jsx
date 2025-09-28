import React, { useState, useEffect } from "react";
import { addInventory, fetchProducts } from "../../api/AdminAPI";

const AdminNavBar = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectProduct, setSelectProducts] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };
    loadProducts();
  }, []); // Run once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectProduct || !quantity) {
      alert("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      await addInventory(selectProduct, Number(quantity));
      alert("Inventory added successfully");
      setShowForm(false);
      setSelectProducts("");
      setQuantity("");
      // Optionally reload products if needed here
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex justify-between items-center px-10 py-5 text-[#444444] bg-[#fec5d1] border-b border-[#ffffff1a] shadow-lg">
      <h1 className="text-3xl font-extrabold tracking-wide animate-pulse">
        TRYnSTYLE
      </h1>
      <ul className="flex gap-8 text-lg font-medium">
        <li className="hover:text-pink-400 transition duration-300 cursor-pointer">
          User Management
        </li>
        <li className="hover:text-pink-400 transition duration-300 cursor-pointer">
          Inventory Management
        </li>
      </ul>
      <button
        onClick={() => setShowForm(true)}
        className="bg-pink-500 hover:bg-pink-600 transition duration-300 text-white font-semibold py-2 px-5 rounded-xl shadow-md hover:shadow-lg"
      >
        + Add Inventory
      </button>

      {showForm && (
        <div className="absolute top-20 right-10 bg-white p-6 rounded-2xl shadow-2xl w-96 border border-pink-300 animate-fade-in z-20">
          <h2 className="text-xl font-bold mb-4 text-pink-600">Add Inventory</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-600">
                Select Product
              </label>
              <select
                value={selectProduct}
                onChange={(e) => setSelectProducts(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="">-- Choose a Product --</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-600">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold transition duration-300"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminNavBar;
