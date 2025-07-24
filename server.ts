import app from './app';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './database/db.config';
import { connectRedis } from './config/redis.config';
import { createAdminUser } from './helpers/seeds/create_admin';
import path from 'path';
import open from 'open';
import fs from 'fs';
dotenv.config();


const PORT = Number(process.env.PORT) || 3000;
const server = http.createServer(app);

// config for swagger opening in dev mode
const isDev = process.env.NODE_ENV !== 'production';
const swaggerUrl = `http://localhost:${PORT}/api-docs`;
const tempFile = path.resolve(__dirname, '.swagger-opened');

// --- Cleanup function ---
function cleanUpSwaggerFlag() {
    if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
    }
}

// --- Start server ---
server.listen(PORT, async () => {
    try {
        await Promise.all([
            connectDB(),
            createAdminUser(),
            connectRedis(),
        ]);

        if (isDev && !fs.existsSync(tempFile)) {
            await open(swaggerUrl);
            fs.writeFileSync(tempFile, 'opened');
        }


        console.log(`Swagger docs at ${swaggerUrl}`);
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        console.error('Startup error:', err);
        process.exit(1);
    }
});

// --- Graceful shutdown ---
process.on('exit', cleanUpSwaggerFlag);

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received. Closing server...');
    server.close(() => {
        cleanUpSwaggerFlag();
        console.log('Server closed gracefully.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.info('SIGINT signal received. Closing server...');
    server.close(() => {
        cleanUpSwaggerFlag();
        console.log('Server closed gracefully.');
        process.exit(0);
    });
});

server.on('error', (err: NodeJS.ErrnoException) => {
    console.error('Server error:', err);
    process.exit(1);
});
