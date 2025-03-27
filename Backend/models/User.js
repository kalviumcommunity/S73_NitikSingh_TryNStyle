const mongoose = require("mongoose"); 
//Mongoose is an object Data Modeling library for MonGoDB and Node.js.

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("User", UserSchema);