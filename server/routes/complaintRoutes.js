// server/routes/complaintRoutes.js
import express from 'express';
import { createComplaint } from '../controllers/complaintController.js';

const router = express.Router();

router.post('/', createComplaint); // POST request to /api/complaints will call createComplaint

export default router;

