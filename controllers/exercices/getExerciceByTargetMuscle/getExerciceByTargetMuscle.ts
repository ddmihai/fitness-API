import { Request, Response } from "express";
import { sendError } from "../../../helpers/http_responses/error.service";
import { redisClient } from "../../../config/redis.config";
import Exercice, { IExercise } from "../../../models/exercice.model";
import { requestExerciseDB } from "../../../helpers/requestExerciceData/exerciceDB.service";

/**
 * Fetches exercises by target muscle:
 *  1. Tries Redis cache
 *  2. Checks MongoDB
 *  3. If not found, fetches from external API
 *  4. Saves new ones to DB (no duplicates), updates Redis
 */
export const getExercisesByTargetMuscle = async (request: Request, response: Response) => {
    try {
        const rawTarget = request.params.targetMuscle;

        // ✅ Validate input early
        if (!rawTarget || typeof rawTarget !== 'string' || rawTarget.trim() === '') {
            return sendError(response, 400, 'Invalid target muscle parameter', 'The target muscle parameter must be a non-empty string.');
        }

        // ✅ Normalize input
        const normalizedTarget = rawTarget.toLowerCase().trim();
        const cacheKey = `exercises:${normalizedTarget}`;

        // ✅ Check Redis cache first
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return response.status(200).json({
                status: 'success',
                message: 'Fetched from Redis cache',
                data: JSON.parse(cached)
            });
        }

        const userId = (request as any).user?.id || 'system';

        // ✅ Check MongoDB
        const exercisesFromDB = await Exercice.find({ target: normalizedTarget });
        if (exercisesFromDB.length > 0) {
            // Set cache asynchronously
            redisClient.set(cacheKey, JSON.stringify(exercisesFromDB), { EX: 60 * 60 * 10 }).catch(console.error);
            return response.status(200).json({
                status: 'success',
                message: `Exercises fetched successfully from DB for target muscle: ${normalizedTarget}`,
                data: exercisesFromDB
            });
        }

        // ✅ Optional: Cache API result briefly to avoid repeated fetches (15 min)
        const apiCacheKey = `exercises:api:${normalizedTarget}`;
        const cachedAPI = await redisClient.get(apiCacheKey);
        let exercisesFromAPI: IExercise[];

        if (cachedAPI) {
            exercisesFromAPI = JSON.parse(cachedAPI);
        } else {
            const endpoint = `exercises/target/${normalizedTarget}`;
            exercisesFromAPI = await requestExerciseDB({ endpoint }) as IExercise[];


            if (!exercisesFromAPI || !Array.isArray(exercisesFromAPI) || exercisesFromAPI.length === 0) {
                return sendError(response, 404, 'No exercises found', `No exercises found for target muscle: ${normalizedTarget}`);
            }

            // Cache API response temporarily to reduce external calls
            redisClient.set(apiCacheKey, JSON.stringify(exercisesFromAPI), { EX: 60 * 15 }).catch(console.error); // 15 minutes
        }

        // ✅ Bulk upsert (prevent duplicates)
        const operations = exercisesFromAPI.map((exercise: IExercise) => ({
            updateOne: {
                filter: { name: exercise.name, bodyPart: exercise.bodyPart },
                update: {
                    $setOnInsert: {
                        ...exercise,
                        addedBy: userId,
                        addedAt: new Date(),
                        isManual: false
                    }
                },
                upsert: true
            }
        }));

        const bulkResult = await Exercice.bulkWrite(operations, { ordered: false });

        // ✅ Refetch to return consistent data
        const allExercises = await Exercice.find({ target: normalizedTarget });

        // ✅ Set TTL based on manual entries
        const hasManual = allExercises.some((ex: any) => ex.isManual === true);
        const ttl = hasManual ? 60 * 60 * 2 : 60 * 60 * 10;

        redisClient.set(cacheKey, JSON.stringify(allExercises), { EX: ttl }).catch(console.error);

        return response.status(201).json({
            status: 'success',
            message: `Exercises saved and returned for target muscle: ${normalizedTarget}`,
            insertedCount: bulkResult.upsertedCount || 0,
            data: allExercises
        });
    }
    catch (error: any) {
        console.error("getExercisesByTargetMuscle error:", error);
        return sendError(
            response,
            error.statusCode || 500,
            error.message || 'Internal Server Error',
            error.details || null
        );
    }
};
