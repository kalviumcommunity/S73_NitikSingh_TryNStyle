const express = require("express");
const bcrypt = require("bcryptjs"); // used for the hash the password.
const jwt = require("jsonwebtoken");  //used for the authentication and authorization.
const User = require("../models/User");

const router = express.Router();
//async and await is the modern function for handling asynchrous operations in a cleaner way.
//async always return a promise
//await is to pauses the excecution of the function util the promise is reslove.

router.post("/register", async (req, res)=>{
    try{
        const { name, email, password} = req.body;

        let user = await User.findOne({email}); // findone is to retrive a data from the collection that matches with a particular query.
        if(!user) return res.status(400).json({message: "User already exists"});

        // hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save user
        user = new User({name, email, password: hashedPassword});
        await user.save();

        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
});
// Login
router.post("/login", async (req, res)=>{
    try{
        const {email, password} = req.body;
        // Check user
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid credentials"});

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid credentials"})

        //Generate Token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,{expiresIn: "1h"});
        res.json({message: "Login successful", token});
    }catch (error){
        res.status(500).json({message: "Server Error"})
    }
})
module.exports = router;