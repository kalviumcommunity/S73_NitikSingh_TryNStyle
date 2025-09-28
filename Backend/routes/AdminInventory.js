const express = require('express');
const router = express.Router();
const Inventory = require("../models/Inventory");
const Products = require("../models/Product");

router.post('/add', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: "Valid productId and quantity are required" });
        }

        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        let inventory = await Inventory.findOne({ product: productId });

        if (inventory) {
            // Update existing inventory
            inventory.quantity += quantity;
            await inventory.save();
            return res.status(200).json({ message: "Inventory updated successfully", inventory });
        } else {
            // Create new inventory
            inventory = new Inventory({
                product: productId,
                quantity,
            });
            await inventory.save();
            res.status(201).json({ message: "Inventory added successfully", inventory });
        }

    } catch (error) {
        console.error("Error in /add inventory:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
