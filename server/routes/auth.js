import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Admin from '../models/Admin.js';

const router = express.Router();

// Arrow function — clean and reusable
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── STUDENT ROUTES ───────────────────────────────────────────

// POST /api/auth/student/register
router.post('/student/register', async (req, res) => {
  const { name, registrationNumber, email, phoneNumber, password } = req.body; // Destructuring

  try {
    const exists = await Student.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Student already exists' });

    const student = await Student.create({ name, registrationNumber, email, phoneNumber, password });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      registrationNumber: student.registrationNumber,
      role: student.role,
      token: generateToken(student._id, student.role),
    });
  } catch ({ message }) { // Destructure error directly
    res.status(500).json({ message });
  }
});

// POST /api/auth/student/login
router.post('/student/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    const isMatch = await student?.matchPassword(password); // Optional chaining

    if (!student || !isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      token: generateToken(student._id, student.role),
    });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

// ─── ADMIN ROUTES ─────────────────────────────────────────────

// POST /api/auth/admin/register
// POST /api/auth/admin/register
router.post('/admin/register', async (req, res) => {
  const { name, email, staffId, password, adminSecret } = req.body;

  // 👇 Check secret key before allowing registration
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Invalid admin secret key' });
  }

  try {
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({ name, email, staffId, password });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      staffId: admin.staffId,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});// POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    const isMatch = await admin?.matchPassword(password);

    if (!admin || !isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      staffId: admin.staffId,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});



export default router;