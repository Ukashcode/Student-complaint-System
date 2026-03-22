// server/models/Complaint.js
import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the complaint'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description for the complaint'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category for the complaint'],
        enum: [
            'Academic',
            'Administrative',
            'Facilities',
            'IT Support',
            'Welfare',
            'Security',
            'Other'
        ]
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    submittedBy: { // This will eventually link to a User ID
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Reference to a User model (we'll create this later)
        // required: true // Make this required once we have user authentication
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);

export default Complaint;