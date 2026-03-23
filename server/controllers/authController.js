// server/controllers/authController.js
import User from '../models/User.js'; // Import the User model

// Helper function to send JWT in a cookie or JSON response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken(); // Generate JWT

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Convert days to milliseconds
        httpOnly: true // Makes cookie inaccessible to client-side scripts (security)
    };

    // If in production, ensure cookies are secure (sent over HTTPS)
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie('token', token, options) // Set JWT in an HttpOnly cookie
        .json({
            success: true,
            token, // Also send token in JSON for easier client-side debugging/storage
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } // role will be 'student' by default for new registrations unless specified
            = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role // Default to 'student' if not provided
        });

        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Error registering user:', error);

        // Handle duplicate email error (MongoDB duplicate key error code is 11000)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        res.status(500).json({ success: false, message: 'Server Error: Could not register user.' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password.' });
        }

        // Check for user
        // .select('+password') is needed because password has `select: false` in schema
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' }); // 401 Unauthorized
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ success: false, message: 'Server Error: Could not log in user.' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private (requires authentication) - To be implemented later with auth middleware
const getMe = async (req, res, next) => {
    // req.user will be available from the protect middleware (to be implemented)
    const user = await User.findById(req.user.id); // Assuming req.user.id is set by auth middleware

    res.status(200).json({
        success: true,
        data: user
    });
};


export { register, login, getMe };