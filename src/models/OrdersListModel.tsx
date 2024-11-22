const { mongoose } = require("mongoose");
require('./AccountsModel');
require('./MerchantPackagesListModel');

const OrdersListModelSchema = new mongoose.Schema({
    referredBy: {
        type: String,
    },
    isPointsSharedToReferred: {
        type: Boolean,
        default: false
    },
    pointsSharedToReferred: {
        type: Number,
        default: 0
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts'
    },
    buyerFullName: {
        type: String,
        required: true
    },
    buyerUserName: {
        type: String,
        required: true
    },
    buyerProfilePic: {
        type: String,
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts'
    },
    merchantUserName: {
        type: String,
        required: true
    },
    userProfilePic: {
        type: String,
        required: true
    },
    merchantBusinessName: {
        type: String,
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'merchantPackagesList'
    },
    serviceName: {
        type: String,
        required: true
    },
    packageName: {
        type: String,
        required: true
    },
    packageDescription: {
        type: String,
        required: true
    },
    packageImage: {
        type: String,
        required: true
    },
    serviceCurrency: {
        type: String,
        required: true
    },
    packageAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    },
    orderReviewed: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
    },
    isPointsShared: {
        type: Boolean,
        default: false
    },
    pointsShared: {
        type: Number,
        default: 0
    },
    discountPoints: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

OrdersListModelSchema.index({ buyerId: 1 });
OrdersListModelSchema.index({ merchantId: 1 });
OrdersListModelSchema.index({ packageId: 1 });
OrdersListModelSchema.index({ orderStatus: 1 });

export default mongoose.models.orderslist || mongoose.model('orderslist', OrdersListModelSchema);