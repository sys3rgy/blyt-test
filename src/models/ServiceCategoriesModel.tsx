const { mongoose } = require("mongoose");

const serviceCategoriesModelSchema = new mongoose.Schema({
    category: {
        type: String,
    },
    link: {
        type: String,
    }
}, { timestamps: true })

serviceCategoriesModelSchema.index({ category: 1 });

export default mongoose.models.serviceCategories || mongoose.model('serviceCategories', serviceCategoriesModelSchema);