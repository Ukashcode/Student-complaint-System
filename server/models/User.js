import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // Prevents duplicate accounts
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // When we fetch a user, don't send the password by default
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'staff'],
        default: 'student'
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);