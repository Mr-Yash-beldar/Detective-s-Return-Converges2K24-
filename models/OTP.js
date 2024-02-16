const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    uniqueCode: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 10,    // auto-Delete doc after  10 min
    }
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;

