// server/index.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import complaintRoutes from './routes/complaintRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Import auth routes
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routers
app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes); // Use the authentication routes for /api/auth

// Basic Route
app.get('/', (req, res) => {
    res.send('Student Complaint System API (ES6 Modules)');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});