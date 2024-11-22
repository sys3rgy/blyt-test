const { mongoose } = require("mongoose");

const pointsHistoryModelSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    points: {
        type: Number,
    },
    reason: {
        type: String,
    }
}, { timestamps: true })

pointsHistoryModelSchema.index({ userName: 1 });

export default mongoose.models.pointshistory || mongoose.model('pointshistory', pointsHistoryModelSchema);