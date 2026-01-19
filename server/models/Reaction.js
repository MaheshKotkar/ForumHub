import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reaction: {
        type: String,
        enum: ['like', 'dislike'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure one reaction per user per post
reactionSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Reaction', reactionSchema);
