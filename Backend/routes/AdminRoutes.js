// routes/AdminRoutes.js
const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

// Optional: Add admin authentication middleware here
// const isAdmin = (req, res, next) => {
//     if (req.user && req.user.role === 'admin') {
//         return next();
//     }
//     return res.status(403).json({ error: "Access denied" });
// };

// @desc Get total user count
router.get('/users/count', async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: "Server error while counting users" });
    }
});

// @desc Get total order count
router.get('/orders/count', async (req, res) => {
    try {
        const count = await Order.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: "Server error while counting orders" });
    }
});

// @desc Get total revenue
router.get('/revenue/total', async (req, res) => {
    try {
        const result = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
        ]);
        const total = result[0]?.totalRevenue || 0;
        res.json({ totalRevenue: total });
    } catch (err) {
        res.status(500).json({ error: "Failed to calculate revenue" });
    }
});

// @desc Get count of low stock inventory items (quantity < 5)
router.get('/inventory/low', async (req, res) => {
    try {
        const count = await Inventory.countDocuments({ quantity: { $lt: 5 } });
        res.json({ lowStockCount: count });
    } catch (err) {
        res.status(500).json({ error: "Server error while checking low stock" });
    }
});

// @desc Get 5 most recent orders
router.get('/orders/recent', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
        res.json({ orders });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch recent orders" });
    }
});

// @desc Get top-selling product
router.get('/products/top', async (req, res) => {
    try {
        const top = await Order.aggregate([
            { $unwind: "$products" },
            { $group: { _id: "$products.productId", totalSold: { $sum: "$products.quantity" } } },
            { $sort: { totalSold: -1 } },
            { $limit: 1 }
        ]);
        res.json({ topProduct: top[0] || null });
    } catch (err) {
        res.status(500).json({ error: "Error finding top-selling product" });
    }
});

// @desc Get full dashboard summary
router.get('/dashboard/summary', async (req, res) => {
    try {
        const [userCount, orderCount, inventoryLow, revenue] = await Promise.all([
            User.countDocuments(),
            Order.countDocuments(),
            Inventory.countDocuments({ quantity: { $lt: 5 } }),
            Order.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
        ]);

        res.json({
            userCount,
            orderCount,
            lowStockCount: inventoryLow,
            totalRevenue: revenue[0]?.total || 0,
        });
    } catch (err) {
        res.status(500).json({ error: "Error fetching dashboard summary" });
    }
});

module.exports = router;
