const { mongoose } = require("mongoose");

const pointsPriceModelSchema = new mongoose.Schema({
    points: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export default mongoose.models.pointsPrice || mongoose.model('pointsPrice', pointsPriceModelSchema);