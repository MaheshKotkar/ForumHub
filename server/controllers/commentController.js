import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Get all comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public
export const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId, parentId: null })
            .populate('userId', 'fullName username')
            .populate({
                path: 'parentId',
                populate: { path: 'userId', select: 'fullName username' }
            })
            .sort({ createdAt: -1 });

        // Get replies for each comment
        const commentsWithReplies = await Promise.all(
            comments.map(async (comment) => {
                const replies = await Comment.find({ parentId: comment._id })
                    .populate('userId', 'fullName username')
                    .sort({ createdAt: 1 });
                return {
                    ...comment.toObject(),
                    replies
                };
            })
        );

        res.json(commentsWithReplies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to post
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res) => {
    try {
        const { postId, comment, parentId } = req.body;

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = await Comment.create({
            postId,
            userId: req.user._id,
            comment,
            parentId: parentId || null
        });

        const populatedComment = await Comment.findById(newComment._id)
            .populate('userId', 'fullName username');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user owns the comment
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Delete comment and its replies
        await Comment.deleteMany({ $or: [{ _id: req.params.id }, { parentId: req.params.id }] });

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
