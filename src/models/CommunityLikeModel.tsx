const { mongoose } = require("mongoose");
require('./AccountsModel');
require('./MerchantPackagesListModel');

const CommunityLikeModelSchema = new mongoose.Schema({
    community_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'community'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts'
    }, 
}, { timestamps: true })

CommunityLikeModelSchema.index({ merchantId: 1 }); 

export default mongoose.models.communityLike || mongoose.model('communityLike', CommunityLikeModelSchema);