// src/config/redis.config.ts

import { createClient } from 'redis';

const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction && process.env.REDIS_URL) {
    console.warn("⚠️ Warning: REDIS_URL is set in development! Make sure you're not using production Redis.");
}


// dw
export const redisClient = createClient({
    url: isProduction
        ? process.env.REDIS_URL
        : 'redis://127.0.0.1:6379',
});

redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error', err);
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('✅ Connected to Redis');
    } catch (err) {
        console.error('❌ Redis connection failed', err);
    }
};
