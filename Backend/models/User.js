const mongoose = require("mongoose"); 

const AddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    addresses: [AddressSchema],
    preferences: {
        bodyType: { type: String, default: "" },
        preferredStyles: [String],
        preferredSizes: {
            top: { type: String, default: "" },
            bottom: { type: String, default: "" },
            shoe: { type: String, default: "" }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);