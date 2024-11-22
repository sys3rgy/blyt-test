import mongoose from "mongoose";

const suggestionsModelSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    businessName: {
        type: String,
    },
    serviceCategory: {
        type: String,
    },
    serviceName: {
        type: String,
    },
    packageName: {
        type: String,
    },
}, { timestamps: true })

suggestionsModelSchema.index({ userName: 1 });
suggestionsModelSchema.index({ businessName: 1 });
suggestionsModelSchema.index({ serviceCategory: 1 });
suggestionsModelSchema.index({ serviceName: 1 });
suggestionsModelSchema.index({ packageName: 1 });

export default mongoose.models.suggestions || mongoose.model('suggestions', suggestionsModelSchema);