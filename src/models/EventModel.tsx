const { mongoose } = require("mongoose");
require('./AccountsModel');
require('./MerchantPackagesListModel');

const EventModelSchema = new mongoose.Schema({
    postTitle: {
        type: String,
    },
    coverImage: {
        type: String, 
    },
    description: {
        type: Number,
        default: 0
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts'
    },
}, { timestamps: true })

EventModelSchema.index({ merchantId: 1 }); 

export default mongoose.models.Event || mongoose.model('event', EventModelSchema);