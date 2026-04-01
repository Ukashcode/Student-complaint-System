import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  submitComplaint,
  getMyComplaints,
  getMyComplaintById,
  updateMyComplaint,
  deleteMyComplaint,
} from '../controllers/studentComplaintController.js';
import {
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  getComplaintStats,
  deleteComplaint,
} from '../controllers/adminComplaintController.js';

const router = express.Router();

// ─── ADMIN ROUTES FIRST ───────────────────────────────────────
// ⚠️ These must come before /:id routes or Express will treat
// "admin" as an :id parameter and go to the wrong controller
router.get('/admin/stats', protect, adminOnly, getComplaintStats);
router.get('/admin/all', protect, adminOnly, getAllComplaints);
router.get('/admin/:id', protect, adminOnly, getComplaintById);
router.put('/admin/:id/status', protect, adminOnly, updateComplaintStatus);
router.delete('/admin/:id', protect, adminOnly, deleteComplaint); 

// ─── STUDENT ROUTES AFTER ─────────────────────────────────────
router.post('/', protect, submitComplaint);
router.get('/', protect, getMyComplaints);
router.get('/:id', protect, getMyComplaintById);
router.put('/:id', protect, updateMyComplaint);
router.delete('/:id', protect, deleteMyComplaint);

export default router;

