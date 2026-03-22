// server/index.js
import dotenv from 'dotenv'; // Still need dotenv for other environment variables like PORT
import express from 'express';
import cors from 'cors';
import complaintRoutes from './routes/complaintRoutes.js';
import connectDB from './config/db.js'; // Import the database connection function

// Load environment variables
dotenv.config();

// Connect to the database
connectDB(); // Call the function to connect

const app = express();
const PORT = process.env.PORT || 5000;
// MONGODB_URI is now handled within db.js, no need to define it here anymore

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routers
app.use('/api/complaints', complaintRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Student Complaint System API (ES6 Modules)');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});