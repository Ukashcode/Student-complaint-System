import Student from '../models/Student.js';
import Admin from '../models/Admin.js';

// Helper — picks the right model based on who is logged in
const getUserModel = (role) => role === 'student' ? Student : Admin;

// ─── GET PROFILE ──────────────────────────────────────────────
// GET /api/profile/
const getProfile = async (req, res) => {
  try {
    const Model = getUserModel(req.user.role);

    const user = await Model.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────
// PUT /api/profile/
const updateProfile = async (req, res) => {
  const { name, email, phoneNumber } = req.body;

  try {
    const Model = getUserModel(req.user.role);
    const user = await Model.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only update fields that were actually sent — nullish coalescing
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    // phoneNumber only exists on Student — admins don't have it
    if (req.user.role === 'student' && phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    const updated = await user.save();

    // Build a clean response object without the password
    const { password: _, ...profile } = updated.toObject();

    res.json(profile);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

// ─── CHANGE PASSWORD ──────────────────────────────────────────
// PUT /api/profile/change-password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  try {
    const Model = getUserModel(req.user.role);

    // We need the password field this time — don't use .select('-password')
    const user = await Model.findById(req.user._id);

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Assigning triggers the pre('save') hook which hashes it automatically
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};

export { getProfile, updateProfile, changePassword };