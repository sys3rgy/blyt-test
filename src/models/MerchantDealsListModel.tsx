const { mongoose } = require("mongoose");
require('./AccountsModel');

const merchantDealsListModelSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Types.ObjectId,
        ref: 'accounts'
    },
    merchantUserName: {
        type: String,
    },
    serviceCategory: {
        type: String,
    },
    discountValue: {
        type: String,
    },
    couponCode: {
        type: String,
    },
    couponDescription: {
        type: String,
    },
    stepsToRedeem: {
        type: String,
    },
    dealPicture: {
        type: String,
    }
}, { timestamps: true })

merchantDealsListModelSchema.index({ serviceCategory: 1 });

export default mongoose.models.merchantDealsList || mongoose.model('merchantDealsList', merchantDealsListModelSchema);