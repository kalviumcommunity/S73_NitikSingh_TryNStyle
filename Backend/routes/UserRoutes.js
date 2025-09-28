const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const verifyToken = require('../middleware/AuthMiddleware');

// Get user profile
router.get('/profile/:uid', verifyToken, async (req, res) => {
    try {
        let user = await User.findOne({ firebaseUid: req.params.uid });
        
        if (!user) {
            // Create new user if not found
            user = new User({
                firebaseUid: req.params.uid,
                email: req.user.email,
                name: req.user.email.split('@')[0], // Default name from email
                addresses: [],
                preferences: {
                    bodyType: '',
                    preferredStyles: [],
                    preferredSizes: {
                        top: '',
                        bottom: '',
                        shoe: ''
                    }
                }
            });
            await user.save();
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error in get profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile/:uid', verifyToken, async (req, res) => {
    try {
        // Verify user is updating their own profile
        if (req.user.uid !== req.params.uid) {
            return res.status(403).json({ message: 'Unauthorized: Cannot update other user\'s profile' });
        }

        console.log('Updating profile for UID:', req.params.uid);
        console.log('Request body:', req.body);

        const { firebaseUid, name, email, phoneNumber, preferences } = req.body;

        // First try to find the user
        let user = await User.findOne({ firebaseUid: req.params.uid });

        if (!user) {
            // If user doesn't exist, create a new user
            console.log('Creating new user profile...');
            user = new User({
                firebaseUid: req.params.uid,
                email,
                name: name || 'User',
                phoneNumber: phoneNumber || '',
                preferences: preferences || {},
                addresses: []
            });
        } else {
            // Update existing user
            console.log('Updating existing user profile...');
            user.name = name || user.name;
            user.phoneNumber = phoneNumber;
            user.preferences = preferences || user.preferences;
            user.email = email || user.email;
        }

        // Save the user
        await user.save();
        console.log('User saved successfully:', user);

        res.json(user);
    } catch (error) {
        console.error('Profile update error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data provided', details: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new address
router.post('/addresses/:uid', verifyToken, async (req, res) => {
    try {
        // Verify user is adding to their own profile
        if (req.user.uid !== req.params.uid) {
            return res.status(403).json({ message: 'Unauthorized: Cannot modify other user\'s addresses' });
        }

        const user = await User.findOne({ firebaseUid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newAddress = req.body;
        if (newAddress.isDefault) {
            // If new address is default, remove default from other addresses
            user.addresses = user.addresses.map(addr => ({
                ...addr,
                isDefault: false
            }));
        }

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete address
router.delete('/addresses/:uid/:addressId', verifyToken, async (req, res) => {
    try {
        // Verify user is deleting from their own profile
        if (req.user.uid !== req.params.uid) {
            return res.status(403).json({ message: 'Unauthorized: Cannot modify other user\'s addresses' });
        }

        const user = await User.findOne({ firebaseUid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.addresses = user.addresses.filter(
            addr => addr._id.toString() !== req.params.addressId
        );

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Set default address
router.put('/addresses/:uid/:addressId/default', verifyToken, async (req, res) => {
    try {
        // Verify user is updating their own profile
        if (req.user.uid !== req.params.uid) {
            return res.status(403).json({ message: 'Unauthorized: Cannot modify other user\'s addresses' });
        }

        const user = await User.findOne({ firebaseUid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update all addresses to non-default first
        user.addresses = user.addresses.map(addr => ({
            ...addr,
            isDefault: addr._id.toString() === req.params.addressId
        }));

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error setting default address:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user orders
router.get('/orders/:uid', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.uid })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new address
router.post('/addresses/:uid', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newAddress = req.body;
        if (newAddress.isDefault) {
            // If new address is default, remove default from other addresses
            user.addresses = user.addresses.map(addr => ({
                ...addr,
                isDefault: false
            }));
        }
        user.addresses.push(newAddress);
        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update address
router.put('/addresses/:uid/:addressId', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === req.params.addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }

        const updatedAddress = req.body;
        if (updatedAddress.isDefault) {
            // If updated address is default, remove default from other addresses
            user.addresses = user.addresses.map(addr => ({
                ...addr,
                isDefault: false
            }));
        }
        user.addresses[addressIndex] = updatedAddress;
        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete address
router.delete('/addresses/:uid/:addressId', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.addresses = user.addresses.filter(
            addr => addr._id.toString() !== req.params.addressId
        );
        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;