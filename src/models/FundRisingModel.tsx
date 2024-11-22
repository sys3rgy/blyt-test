const { mongoose } = require("mongoose");
require('./AccountsModel');
require('./MerchantPackagesListModel');

const FundRisingModelSchema = new mongoose.Schema({
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

FundRisingModelSchema.index({ merchantId: 1 }); 

export default mongoose.models.fundRising || mongoose.model('fundRising', FundRisingModelSchema);