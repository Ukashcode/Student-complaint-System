import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getAllStudents, toggleBlockStudent } from '../controllers/adminStudentController.js';

const router = express.Router();

// Admin only
router.get('/admin/all', protect, adminOnly, getAllStudents);
router.put('/admin/:id/block', protect, adminOnly, toggleBlockStudent);

export default router;