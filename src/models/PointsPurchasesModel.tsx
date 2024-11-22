const { mongoose } = require("mongoose");
require('./AccountsModel');

const pointsPurchasesModelSchema = new mongoose.Schema({
    buyerName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    clientIP: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    isPaymentDone: {
        type: Boolean,
        required: false,
        default: null
    },
    isMoneyAddedToAccount: {
        type: Boolean,
        default: null
    },
    isChecked: {
        type: Number,
        default: 0
    },
    buyerId: {
        type: mongoose.Types.ObjectId,
        ref: 'accounts',
        required: true
    },
    buyerUserName: {
        type: String,
        required: true
    },
    uniqueId: {
        type: Number,
        min: 1,
        unique: true,
    },
    /* expireAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }, */
}, { timestamps: true })

export default mongoose.models.pointsPurchases || mongoose.model('pointsPurchases', pointsPurchasesModelSchema);