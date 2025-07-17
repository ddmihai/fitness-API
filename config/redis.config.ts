import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
export const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error', err);
});


export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('✅ Connected to Redis');
    }
    catch (err) {
        console.error('❌ Redis connection failed', err);
    }
};
