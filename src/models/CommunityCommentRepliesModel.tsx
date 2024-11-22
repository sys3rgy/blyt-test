const { mongoose } = require("mongoose");
require('./AccountsModel');
require('./MerchantPackagesListModel');

const CommunityCommentRepliesModelSchema = new mongoose.Schema({ 
    comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communityComment'
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
}, { timestamps: true })

CommunityCommentRepliesModelSchema.index({ merchantId: 1 }); 

export default mongoose.models.communityCommentReplies || mongoose.model('communityCommentReplies', CommunityCommentRepliesModelSchema);