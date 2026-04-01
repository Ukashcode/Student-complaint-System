import Complaint from '../models/Complaint.js';

// GET /api/complaints/admin/all  — Admin sees ALL complaints from every student
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('student', 'name email registrationNumber')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

// GET /api/complaints/admin/:id  — Admin views a single complaint in detail
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'name email registrationNumber phoneNumber')
      .populate('resolvedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

// PUT /api/complaints/admin/:id/status  — Admin updates status and adds remarks
const updateComplaintStatus = async (req, res) => {
  // Guard against empty body
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' });
  }

  const { status, adminRemarks } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const allowedStatuses = ['inReview', 'resolved', 'rejected'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(', ')}` });
  }

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.adminRemarks = adminRemarks ?? complaint.adminRemarks;
    complaint.resolvedBy = req.user._id;

    const updated = await complaint.save();

    await updated.populate('student', 'name email registrationNumber');
    await updated.populate('resolvedBy', 'name email');

    res.json(updated);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

// GET /api/complaints/admin/stats  — Admin sees a summary count by status
const getComplaintStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Turn the array into a clean object e.g. { pending: 5, resolved: 3 }
    const formatted = stats.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    res.json(formatted);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

// DELETE /api/complaints/admin/:id  — Admin deletes a complaint
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

export { getAllComplaints, getComplaintById, updateComplaintStatus, getComplaintStats, deleteComplaint };
