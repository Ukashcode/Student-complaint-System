// server/routes/authRoutes.js
import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register); // Route for user registration
router.post('/login', login);       // Route for user login
router.get('/me', getMe);           // Route to get current user details (will be protected)

export default router;