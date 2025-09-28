const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyToken = require('../middleware/AuthMiddleware');

// Get all orders for a user
router.get('/', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Get single order details
router.get('/:orderId', verifyToken, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user._id
        }).populate('items.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
});

// Track order
router.get('/:orderId/track', verifyToken, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const trackingInfo = {
            status: order.status,
            trackingNumber: order.trackingNumber,
            trackingUrl: order.trackingUrl,
            estimatedDeliveryDate: order.estimatedDeliveryDate,
            statusHistory: order.statusHistory,
            lastUpdated: order.updatedAt
        };

        res.json(trackingInfo);
    } catch (error) {
        console.error('Error fetching tracking info:', error);
        res.status(500).json({ message: 'Error fetching tracking information' });
    }
});

// Cancel order
router.post('/:orderId/cancel', verifyToken, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!['pending', 'processing'].includes(order.status)) {
            return res.status(400).json({ 
                message: 'Order cannot be cancelled in its current status' 
            });
        }

        // Update order status
        order.status = 'cancelled';
        order.statusHistory.push({
            status: 'cancelled',
            timestamp: new Date(),
            comment: 'Order cancelled by customer'
        });

        await order.save();

        res.json({ 
            message: 'Order cancelled successfully',
            status: order.status
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Error cancelling order' });
    }
});

// Update order status (Admin only)
router.put('/:orderId/status', verifyToken, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized: Admin access required' });
        }

        const { status, comment, trackingNumber, trackingUrl, estimatedDeliveryDate } = req.body;

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Validate status transition
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Update order
        order.status = status;
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            comment: comment || `Order status updated to ${status}`
        });

        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (trackingUrl) order.trackingUrl = trackingUrl;
        if (estimatedDeliveryDate) order.estimatedDeliveryDate = new Date(estimatedDeliveryDate);

        await order.save();

        res.json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});

module.exports = router;