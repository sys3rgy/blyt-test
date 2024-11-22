const { mongoose } = require("mongoose");

const otpModelSchema = new mongoose.Schema({
    userEmail: {
        type: String,
    },
    userName: {
        type: String,
    },
    OTP: {
        type: String,
    },
    OTPCount: {
        type: Number,
        default: 0
    },
    isMerchant: {
        type: Boolean,
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 300
    },
}, { timestamps: true })

otpModelSchema.index({ userName: 1 });

export default mongoose.models.otp || mongoose.model('otp', otpModelSchema);