const { mongoose } = require("mongoose");
require('./MerchantPackagesListModel');
require('./OrdersListModel');

const adminAccountsModelSchema = new mongoose.Schema({
    //! Client Data
    userName: {
        type: String
    },
    userFullName: {
        type: String
    },
    userEmail: {
        type: String
    },
    userPassword: {
        type: String
    },
    verified: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

adminAccountsModelSchema.index({ userName: 1 }, { unique: true });
adminAccountsModelSchema.index({ 'service.serviceCategory': 1 });

export default mongoose.models.adminAccounts || mongoose.model('adminAccounts', adminAccountsModelSchema);