import Reaction from '../models/Reaction.js';

// @desc    Add or update reaction
// @route   POST /api/reactions
// @access  Private
export const handleReaction = async (req, res) => {
    try {
        const { postId, reaction } = req.body;
        const userId = req.user._id;

        // Check if reaction already exists
        const existingReaction = await Reaction.findOne({ postId, userId });

        if (existingReaction) {
            // Update existing reaction if different, or remove if same
            if (existingReaction.reaction === reaction) {
                // Remove reaction (toggle off)
                await Reaction.findByIdAndDelete(existingReaction._id);
                return res.json({ message: 'Reaction removed' });
            } else {
                // Update to new reaction type
                existingReaction.reaction = reaction;
                await existingReaction.save();
                return res.json(existingReaction);
            }
        }

        // Create new reaction
        const newReaction = await Reaction.create({
            postId,
            userId,
            reaction
        });

        res.status(201).json(newReaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reactions for a post
// @route   GET /api/reactions/post/:postId
// @access  Public
export const getPostReactions = async (req, res) => {
    try {
        const reactions = await Reaction.find({ postId: req.params.postId });

        const likes = reactions.filter(r => r.reaction === 'like').length;
        const dislikes = reactions.filter(r => r.reaction === 'dislike').length;

        res.json({ likes, dislikes, reactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
