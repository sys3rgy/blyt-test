const { mongoose } = require("mongoose");
require('./AccountsModel');
require('./MerchantPackagesListModel');
require('./OrdersListModel');

const sessionsModelSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userFullName: {
        type: String,
    },
    jwtToken: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts',
        required: true,
    },
    isMerchant: {
        type: Boolean,
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 300
    },
}, { timestamps: true })

export default mongoose.models.sessions || mongoose.model('sessions', sessionsModelSchema);