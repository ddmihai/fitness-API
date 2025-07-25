import mongoose from "mongoose";
import ENV from "./env.config";


// create function to establish database connection
const connectDB = async () => {
    try {
        const dbURI = process.env.NODE_ENV === 'production' ? ENV.MONGO_URI_PRODUCTION : ENV.MONGO_URI;
        await mongoose.connect(dbURI);


        mongoose.connection.on('connected', () => console.log('Mongoose connected'));
        mongoose.connection.on('error', err => console.error('Mongoose connection error:', err));
        mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));


        const message = process.env.NODE_ENV === 'production' ? 'Production database connected successfully' : 'Development database connected successfully';
        console.log(message);
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;
