import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Admin from '../models/Admin.js';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const { id, role } = jwt.verify(token, process.env.JWT_SECRET); // Destructure straight away

    // Fetch the right user based on role
    const userModel = role === 'student' ? Student : Admin;
    req.user = await userModel.findById(id).select('-password');

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const adminOnly = (req, res, next) => {
  req.user?.role === 'admin'
    ? next()
    : res.status(403).json({ message: 'Access denied: Admins only' });
};

export { protect, adminOnly };