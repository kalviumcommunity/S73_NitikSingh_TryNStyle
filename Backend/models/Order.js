const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    }
});

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [OrderItemSchema],
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    amount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    trackingNumber: {
        type: String
    },
    trackingUrl: {
        type: String
    },
    estimatedDeliveryDate: {
        type: Date
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"]
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        comment: {
            type: String
        }
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("Order", OrderSchema);