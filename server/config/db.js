// server/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Import dotenv here as well, if you only want to load DB-related env vars

dotenv.config(); // Ensure env vars are loaded for this module too

const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            console.error('Error: MONGODB_URI is not defined in .env');
            process.exit(1); // Exit process with failure
        }

        const conn = await mongoose.connect(MONGODB_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;