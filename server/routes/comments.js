import express from 'express';
import { getCommentsByPost, addComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/post/:postId', getCommentsByPost);
router.post('/', protect, addComment);
router.delete('/:id', protect, deleteComment);

export default router;
