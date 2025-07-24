import { redisClient } from '../../../config/redis.config';
import { Request, Response } from 'express';
import { sendError } from '../../../helpers/http_responses/error.service';
import Exercice from '../../../models/exercice.model';



export const getAllExercices = async (req: Request, res: Response) => {
    try {
        // Parse page and limit from query params, with defaults
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
        const skip = (page - 1) * limit;

        // Create a unique cache key based on pagination params
        const cacheKey = `exercices:page:${page}:limit:${limit}`;

        // Attempt to get cached data from Redis
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            return res.status(200).json({
                ...parsedData,
                fromCache: true, // optional flag to indicate response is cached
            });
        }

        // Cache miss — query DB
        const totalCount = await Exercice.countDocuments();

        const exercices = await Exercice.find()
            .skip(skip)
            .limit(limit)
            .lean();

        const totalPages = Math.ceil(totalCount / limit);

        const responsePayload = {
            data: exercices,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalPages,
                totalCount,
            },
        };

        // Cache the response as string with TTL (5 minutes)
        await redisClient.set(cacheKey, JSON.stringify(responsePayload), { EX: 300 });

        // Return fresh data
        return res.status(200).json(responsePayload);
    } catch (error) {
        if (error instanceof Error) {
            return sendError(res, 500, error.message, 'Error querying exercices');
        }
        return sendError(res, 500, 'Unknown error querying exercices');
    }
};
