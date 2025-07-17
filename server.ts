import app from './app';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './database/db.config';
import { connectRedis } from './config/redis.config';
import { createAdminUser } from './helpers/seeds/create_admin';
dotenv.config();


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);


server.listen(PORT, async () => {
    await connectDB();
    await createAdminUser();
    await connectRedis();
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});


process.on('SIGTERM', () => {
    console.info('SIGTERM signal received. Closing server...');
    server.close(() => {
        console.log('Server closed gracefully.');
        process.exit(0);
    });
});


process.on('SIGINT', () => {
    console.info('SIGINT signal received. Closing server...');
    server.close(() => {
        console.log('Server closed gracefully.');
        process.exit(0);
    });
});

server.on('error', (err: NodeJS.ErrnoException) => {
    console.error('Server error:', err);
    process.exit(1);
});