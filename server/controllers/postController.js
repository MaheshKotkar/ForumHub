import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Get all posts with filtering
// @route   GET /api/posts
// @access  Public/Private
export const getPosts = async (req, res) => {
    try {
        const { search, category } = req.query;
        const userId = req.user?._id;

        let query = {};

        // Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        // Privacy filter
        if (userId) {
            // Show public posts and user's private posts
            query.$or = [
                { privacy: 'public' },
                { privacy: 'private', userId: userId }
            ];

            // Combine with search if exists
            if (search) {
                query = {
                    $and: [
                        { $or: [{ privacy: 'public' }, { privacy: 'private', userId: userId }] },
                        {
                            $or: [
                                { title: { $regex: search, $options: 'i' } },
                                { content: { $regex: search, $options: 'i' } }
                            ]
                        }
                    ]
                };
            }
        } else {
            // Only public posts for non-logged-in users
            query.privacy = 'public';
        }

        const posts = await Post.find(query)
            .populate('userId', 'fullName username')
            .sort({ updatedAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('userId', 'fullName username email');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { title, content, category, privacy } = req.body;

        const post = await Post.create({
            userId: req.user._id,
            title,
            content,
            category: category || 'General',
            privacy: privacy || 'public',
            image: req.files?.image ? req.files.image[0].filename : null,
            video: req.files?.video ? req.files.video[0].filename : null
        });

        const populatedPost = await Post.findById(post._id)
            .populate('userId', 'fullName username');

        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user owns the post
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        const { title, content, category, privacy } = req.body;

        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;
        post.privacy = privacy || post.privacy;

        if (req.files?.image) {
            post.image = req.files.image[0].filename;
        }
        if (req.files?.video) {
            post.video = req.files.video[0].filename;
        }

        const updatedPost = await post.save();
        const populatedPost = await Post.findById(updatedPost._id)
            .populate('userId', 'fullName username');

        res.json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user owns the post
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Private
export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId })
            .populate('userId', 'fullName username')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
