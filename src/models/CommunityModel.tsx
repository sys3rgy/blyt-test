const { mongoose } = require("mongoose");
require('./AccountsModel');
require('./MerchantPackagesListModel');

const CommunityModelSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    image: {
        type: String, 
    },
    description: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts'
    },
}, { timestamps: true })

CommunityModelSchema.index({ merchantId: 1 }); 

export default mongoose.models.community || mongoose.model('community', CommunityModelSchema);