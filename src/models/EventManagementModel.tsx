const { mongoose } = require("mongoose");
require('./AccountsModel');
require('./MerchantPackagesListModel');

const EventManagementModelSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String, 
    },
    event_date: {
        type: Date,
    },
    event_location: {
        type: String,
    },
    event_closed_date: {
        type: Date,
    },
    description: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts'
    },
}, { timestamps: true })

EventManagementModelSchema.index({ merchantId: 1 }); 

export default mongoose.models.eventManagement || mongoose.model('eventManagement', EventManagementModelSchema);