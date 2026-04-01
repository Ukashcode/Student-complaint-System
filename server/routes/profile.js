import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController.js';

const router = express.Router();

// All profile routes require the user to be logged in
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;