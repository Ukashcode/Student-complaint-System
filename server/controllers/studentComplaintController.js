import Complaint from '../models/Complaint.js';

// POST /api/complaints/  — Submit a new complaint
const submitComplaint = async (req, res) => {
  const { title, description, category } = req.body;

  try {
    const complaint = await Complaint.create({
      title,
      description,
      category,
      student: req.user._id, // Comes from the protect middleware (logged in student)
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// GET /api/complaints/  — Student sees only their own complaints
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user._id })
      .sort({ createdAt: -1 }); // Newest first

    res.json(complaints);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

// GET /api/complaints/:id  — Student views one of their complaints
const getMyComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Make sure the complaint belongs to the logged in student
    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    res.json(complaint);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

// PUT /api/complaints/:id  — Student updates their complaint (only if still pending)
const updateMyComplaint = async (req, res) => {
  const { title, description, category } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this complaint' });
    }

    // Students can only edit complaints that haven't been picked up yet
    if (complaint.status !== 'pending') {
      return res.status(400).json({ message: `Cannot edit a complaint that is already ${complaint.status}` });
    }

    // Only update fields that were actually sent
    complaint.title = title ?? complaint.title;
    complaint.description = description ?? complaint.description;
    complaint.category = category ?? complaint.category;

    const updated = await complaint.save();
    res.json(updated);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

// DELETE /api/complaints/:id  — Student deletes their complaint (only if still pending)
const deleteMyComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this complaint' });
    }

    if (complaint.status !== 'pending') {
      return res.status(400).json({ message: `Cannot delete a complaint that is already ${complaint.status}` });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

export {
  submitComplaint,
  getMyComplaints,
  getMyComplaintById,
  updateMyComplaint,
  deleteMyComplaint,
};