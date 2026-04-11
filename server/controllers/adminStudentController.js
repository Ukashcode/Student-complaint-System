import Student from '../models/Student.js';

// GET /api/students/admin/all — Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

// PUT /api/students/admin/:id/block — Toggle block/unblock
const toggleBlockStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Flip the block status
    student.isBlocked = !student.isBlocked;
    await student.save();

    res.json({
      message: `Student ${student.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      isBlocked: student.isBlocked,
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        registrationNumber: student.registrationNumber,
        isBlocked: student.isBlocked,
      },
    });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

export { getAllStudents, toggleBlockStudent };