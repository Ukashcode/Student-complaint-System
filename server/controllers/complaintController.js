// server/controllers/complaintController.js
import Complaint from '../models/Complaint.js'; // Import our Complaint model

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Public (for now, will be private to students later)
const createComplaint = async (req, res) => {
    try {
        // We'll eventually get submittedBy from req.user when we implement auth
        // For now, let's allow without submittedBy or hardcode for testing
        const { title, description, category } = req.body;

        // Basic validation (more robust validation can be added with libraries like express-validator)
        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Please include all required fields: title, description, and category.' });
        }

        const complaint = await Complaint.create({
            title,
            description,
            category,
            // submittedBy: req.user._id, // Uncomment when authentication is in place
        });

        res.status(201).json({
            success: true,
            data: complaint
        });

    } catch (error) {
        console.error('Error creating complaint:', error);
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

export { createComplaint };

//mongodb+srv://ukashatui478_db_user:PngTgf9mQ2gCMYEM@cluster0.o8zxgsj.mongodb.net/?appName=Cluster0