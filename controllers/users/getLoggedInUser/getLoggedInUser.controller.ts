import { Request, Response } from 'express';
import User from '../../../models/user.model';
import { sendError } from '../../../helpers/http_responses/error.service';
import { redisClient } from '../../../config/redis.config';

export const getLoggedinUser = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const cacheKey = `user:${user.userId}`;

        // 1. Check cache
        const cachedUser = await redisClient.get(cacheKey);
        if (cachedUser) {
            return res.status(200).json({
                status: 'success (from cache)',
                data: JSON.parse(cachedUser),
            });
        }

        // 2. Fallback to DB
        const requestedUser = await User.findById(user.userId).select('-password');
        if (!requestedUser) {
            return sendError(res, 404, 'User not found', 'User not found');
        }

        // 3. Cache result (safe stringify)
        await redisClient.set(cacheKey, JSON.stringify(requestedUser), { EX: 3600 });

        return res.status(200).json({
            status: 'success',
            data: requestedUser,
        });
    }

    catch (error) {
        console.error('Get logged-in user error:', error);
        return sendError(res, 500, 'Internal server error', 'Something went wrong');
    }
};
