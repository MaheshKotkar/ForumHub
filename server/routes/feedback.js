import express from 'express';
import { submitFeedback, getAllFeedback } from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';
import { protectAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', protect, submitFeedback);
router.get('/', protectAdmin, getAllFeedback);

export default router;
