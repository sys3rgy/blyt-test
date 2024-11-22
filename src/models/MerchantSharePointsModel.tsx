const { mongoose } = require("mongoose");
require('./AccountsModel');

const MerchantSharePointsModelSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: 'orderslist'
    },
    merchantId: {
        type: mongoose.Types.ObjectId,
        ref: 'accounts'
    },
    buyerId: {
        type: mongoose.Types.ObjectId,
        ref: 'accounts'
    },
    pointsToShare: {
        type: Number
    },
    referredUserName: {
        type: String,
    },
    isPaymentDone: {
        type: Boolean,
        default: false
    },
    isPointsTransferred: {
        type: Boolean,
        default: false
    },
    uniqueId: {
        type: Number,
        min: 1,
        unique: true,
    },
}, { timestamps: true })

export default mongoose.models.merchantSharePoints || mongoose.model('merchantSharePoints', MerchantSharePointsModelSchema);