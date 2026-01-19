import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    usability: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    design: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    features: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    satisfaction: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comments: {
        type: String,
        default: ''
    },
    avgRating: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate average rating before saving
feedbackSchema.pre('save', function (next) {
    this.avgRating = (this.usability + this.design + this.features + this.satisfaction) / 4;
    next();
});

export default mongoose.model('Feedback', feedbackSchema);
