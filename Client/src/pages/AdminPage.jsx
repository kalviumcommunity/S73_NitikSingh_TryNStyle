import React, { useContext } from "react";
import AdminDashboard from "../components/adminDashboard/AdminDashboard";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { user, isAdmin, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return <p className="text-center mt-10 text-gray-500">Checking authentication...</p>;

  if (!user) return <Navigate to="/auth" />;

  if (!isAdmin) 
    return (
      <div className="text-center mt-10 text-red-600 text-lg space-y-4">
        <p>Access denied. You are not an admin.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
        >
          Go to Home
        </button>
      </div>
    );

  return <AdminDashboard />;
};

export default AdminPage;
