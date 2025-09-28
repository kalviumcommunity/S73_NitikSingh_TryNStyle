const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const verifyToken = require('../middleware/AuthMiddleware');
const Order = require('../models/Order');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new order
router.post('/create-order', verifyToken, async (req, res) => {
    try {
        const { amount, items, shippingAddress } = req.body;

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'receipt_' + Date.now()
        };

        const order = await razorpay.orders.create(options);

        // Create order in our database
        const newOrder = new Order({
            user: req.user._id,
            items: items,
            amount: amount / 100, // Convert from paise to rupees
            razorpayOrderId: order.id,
            shippingAddress: shippingAddress,
            status: 'pending'
        });

        await newOrder.save();

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Verify payment
router.post('/verify', verifyToken, async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body;

        const body = orderId + "|" + paymentId;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === signature;

        if (isAuthentic) {
            // Update order status in database
            await Order.findOneAndUpdate(
                { razorpayOrderId: orderId },
                { 
                    status: 'paid',
                    razorpayPaymentId: paymentId
                }
            );

            res.json({ verified: true });
        } else {
            res.json({ verified: false });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Error verifying payment' });
    }
});

module.exports = router;