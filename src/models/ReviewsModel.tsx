const { mongoose } = require("mongoose");
require('./AccountsModel');

const reviewsModelModelSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts'
    },
    buyerName: {
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
    merchantBusinessName: {
        type: String,
        required: true
    },
    merchantPackageName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default mongoose.models.reviews || mongoose.model('reviews', reviewsModelModelSchema);