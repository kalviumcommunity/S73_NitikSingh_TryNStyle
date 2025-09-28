const express = require("express");
const User = require("../models/User");
const admin = require('../firebaseConfig');

const router = express.Router();

// Create or update user profile after Firebase authentication
router.post("/create-profile", async (req, res) => {
    try {
        const { uid, email, name, phoneNumber } = req.body;
        
        let user = await User.findOne({ firebaseUid: uid });
        
        if (user) {
            // Update existing user
            user = await User.findOneAndUpdate(
                { firebaseUid: uid },
                { 
                    $set: { 
                        email,
                        name,
                        phoneNumber
                    }
                },
                { new: true }
            );
        } else {
            // Create new user
            user = new User({
                firebaseUid: uid,
                email,
                name,
                phoneNumber,
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

        res.status(201).json({ 
            message: user ? "Profile updated successfully" : "Profile created successfully",
            user 
        });
    } catch (error) {
        console.error('Error in create-profile:', error);
        res.status(500).json({ message: "Server Error" });
    }
});
module.exports = router;