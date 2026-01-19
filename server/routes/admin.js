import express from 'express';
import {
    adminLogin,
    getAllUsers,
    deleteUser,
    deletePostAdmin,
    deleteCommentAdmin,
    getDeletionAlerts,
    dismissAlert
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/adminAuth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/users', protectAdmin, getAllUsers);
router.delete('/users/:id', protectAdmin, deleteUser);
router.delete('/posts/:id', protectAdmin, deletePostAdmin);
router.delete('/comments/:id', protectAdmin, deleteCommentAdmin);
router.get('/alerts/:userId', getDeletionAlerts);
router.delete('/alerts/:id', protect, dismissAlert);

export default router;
