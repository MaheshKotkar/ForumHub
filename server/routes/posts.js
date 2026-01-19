import express from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost, getUserPosts } from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), createPost);
router.put('/:id', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), updatePost);
router.delete('/:id', protect, deletePost);
router.get('/user/:userId', protect, getUserPosts);

export default router;
