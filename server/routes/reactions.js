import express from 'express';
import { handleReaction, getPostReactions } from '../controllers/reactionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, handleReaction);
router.get('/post/:postId', getPostReactions);

export default router;
