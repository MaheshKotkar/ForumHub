import Feedback from '../models/Feedback.js';

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
export const submitFeedback = async (req, res) => {
    try {
        const { usability, design, features, satisfaction, comments } = req.body;

        const feedback = await Feedback.create({
            userId: req.user._id,
            usability,
            design,
            features,
            satisfaction,
            comments
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all feedback (Admin only)
// @route   GET /api/feedback
// @access  Private (Admin)
export const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate('userId', 'fullName email')
            .sort({ createdAt: -1 });

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
