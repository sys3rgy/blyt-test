const { mongoose } = require("mongoose");
require('./AccountsModel');

const merchantPackagesListModelSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Types.ObjectId,
        ref: 'accounts'
    },
    merchantUserName: {
        type: String,
    },
    packageName: {
        type: String,
    },
    serviceCurrency: {
        type: String,
    },
    packagePrice: {
        type: Number,
    },
    packageDescription: {
        type: String,
    },
    packageImages: {
        type: [String],
    },
    packageCategory: {
        type: String
    },
    //! To Be Done Later
    packageReviews: {
        type: [String],
        default: [],
    },
    packageAverageRating: {
        type: Number
    },
}, { timestamps: true })

export default mongoose.models.merchantPackagesList || mongoose.model('merchantPackagesList', merchantPackagesListModelSchema);