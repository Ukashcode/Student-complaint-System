import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['Academic', 'Hostel', 'Finance', 'Transport', 'Other','Faculty'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['pending', 'inReview', 'resolved', 'rejected'],
      default: 'pending', // Every new complaint starts as pending
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student', // Links to the Student model
      required: true,
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', // Links to the Admin who acted on it
      default: null,
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;