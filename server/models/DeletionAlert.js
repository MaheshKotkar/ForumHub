import mongoose from 'mongoose';

const deletionAlertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['post', 'comment', 'reply', 'profile'],
        required: true
    },
    reason: {
        type: String,
        required: [true, 'Reason for deletion is required']
    },
    content: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('DeletionAlert', deletionAlertSchema);
