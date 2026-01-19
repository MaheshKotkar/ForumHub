import express from 'express';
import { submitContact, getContacts } from '../controllers/contactController.js';
import { protectAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', submitContact);
// router.get('/', protectAdmin, getContacts);

export default router;
