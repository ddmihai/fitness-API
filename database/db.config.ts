import mongoose from "mongoose";
import ENV from "../config/env.config";


// create function to establish database connection
const connectDB = async () => {
    try {
        const dbURI = ENV.MONGO_URI;
        await mongoose.connect(dbURI);

        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;
