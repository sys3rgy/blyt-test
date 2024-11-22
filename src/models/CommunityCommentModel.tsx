const { mongoose } = require("mongoose");
require('./AccountsModel');
require('./MerchantPackagesListModel');

const CommunityCommentModelSchema = new mongoose.Schema({ 
    community_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'community'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts'
    },
    text: {
        type: String,
    }, 
    avatar: {
        type: String,
    }, 
    parent_comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
}, { timestamps: true })

CommunityCommentModelSchema.index({ merchantId: 1 }); 

export default mongoose.models.communityComment || mongoose.model('communityComment', CommunityCommentModelSchema);