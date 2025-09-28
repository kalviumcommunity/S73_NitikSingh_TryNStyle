import React, { useState, useEffect } from "react";
import AdminNavBar from "./adminnav";
import DashboardCard from "./DashboardCard";

import {
  fetchUserCount,
  fetchOrdersCount,
  fetchRevenueTotal,
  fetchLowStock,
  fetchRecentOrders,
} from "../../api/AdminAPI";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
    lowStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch dashboard stats once on component mount
    async function fetchData() {
      try {
        setLoading(true);
        const [users, orders, revenue, lowStock, recent] = await Promise.all([
          fetchUserCount(),
          fetchOrdersCount(),
          fetchRevenueTotal(),
          fetchLowStock(),
          fetchRecentOrders(),
        ]);
        setStats({
          users: users?.count ?? 0,
          orders: orders?.count ?? 0,
          revenue: revenue?.total ?? 0,
          lowStock: lowStock?.count ?? 0,
        });
        setRecentOrders(recent?.orders ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []); // run once on mount

  if (loading) return <p>Loading Dashboard data...</p>;
  if (error) return <p>Error loading dashboard: {error}</p>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#444444]">
      <AdminNavBar />
      <div className="p-10 space-y-10">
        {/* cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Total Users" value={stats.users} />
          <DashboardCard title="Total Orders" value={stats.orders} />
          <DashboardCard
            title="Revenue"
            value={`$${(stats.revenue ?? 0).toLocaleString()}`}
          />
          <DashboardCard title="Low Stock Items" value={stats.lowStock} />
        </div>

        {/* Recent Orders */}
        <div className="bg-[#fec5d1] p-6 rounded-xl shadow-md border border-[#D4BEBE]">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p>No recent orders found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-[#D4BEBE] p-2">Order ID</th>
                  <th className="border-b border-[#D4BEBE] p-2">User</th>
                  <th className="border-b border-[#D4BEBE] p-2">Status</th>
                  <th className="border-b border-[#D4BEBE] p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id || order.id}>
                    <td className="border-b border-[#D4BEBE] p-2">{order._id || order.id}</td>
                    <td className="border-b border-[#D4BEBE] p-2">
                      {typeof order.user === "object" && order.user !== null
                        ? order.user.email
                        : order.user || "N/A"}
                    </td>
                    <td className="border-b border-[#D4BEBE] p-2">{order?.status || "N/A"}</td>
                    <td className="border-b border-[#D4BEBE] p-2">{order?.amount || order?.total || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
