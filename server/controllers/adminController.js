import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import DeletionAlert from '../models/DeletionAlert.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: admin._id,
            email: admin.email,
            token: generateToken(admin._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
    try {
        const { reason } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create deletion alert
        await DeletionAlert.create({
            userId: user._id,
            type: 'profile',
            reason
        });

        // Soft delete user
        await User.findByIdAndUpdate(req.params.id, { status: 'deleted' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete post (Admin)
// @route   DELETE /api/admin/posts/:id
// @access  Private (Admin)
export const deletePostAdmin = async (req, res) => {
    try {
        const { reason } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create deletion alert
        await DeletionAlert.create({
            userId: post.userId,
            type: 'post',
            reason,
            content: post.title
        });

        // Delete post
        await Post.findByIdAndDelete(req.params.id);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete comment (Admin)
// @route   DELETE /api/admin/comments/:id
// @access  Private (Admin)
export const deleteCommentAdmin = async (req, res) => {
    try {
        const { reason } = req.body;

        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Create deletion alert
        await DeletionAlert.create({
            userId: comment.userId,
            type: 'comment',
            reason,
            content: comment.comment.substring(0, 100)
        });

        // Delete comment and replies
        await Comment.deleteMany({ $or: [{ _id: req.params.id }, { parentId: req.params.id }] });

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get deletion alerts for user
// @route   GET /api/admin/alerts/:userId
// @access  Public (for user to see their own alerts)
export const getDeletionAlerts = async (req, res) => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const alerts = await DeletionAlert.find({
            userId: req.params.userId,
            $or: [
                { type: { $in: ['post', 'comment', 'reply'] }, createdAt: { $gte: sevenDaysAgo } },
                { type: 'profile' }
            ]
        }).sort({ createdAt: -1 });

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dismiss deletion alert
// @route   DELETE /api/admin/alerts/:id
// @access  Private
export const dismissAlert = async (req, res) => {
    try {
        await DeletionAlert.findByIdAndDelete(req.params.id);
        res.json({ message: 'Alert dismissed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
