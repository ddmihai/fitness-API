"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercisesByTargetMuscle = void 0;
const error_service_1 = require("../../../helpers/http_responses/error.service");
const redis_config_1 = require("../../../config/redis.config");
const exercice_model_1 = __importDefault(require("../../../models/exercice.model"));
const exerciceDB_service_1 = require("../../../helpers/requestExerciceData/exerciceDB.service");
/**
 * Fetches exercises by target muscle:
 *  1. Tries Redis cache
 *  2. Checks MongoDB
 *  3. If not found, fetches from external API
 *  4. Saves new ones to DB (no duplicates), updates Redis
 */
const getExercisesByTargetMuscle = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const rawTarget = request.params.targetMuscle;
        // ✅ Validate input early
        if (!rawTarget || typeof rawTarget !== 'string' || rawTarget.trim() === '') {
            return (0, error_service_1.sendError)(response, 400, 'Invalid target muscle parameter', 'The target muscle parameter must be a non-empty string.');
        }
        // ✅ Normalize input
        const normalizedTarget = rawTarget.toLowerCase().trim();
        const cacheKey = `exercises:${normalizedTarget}`;
        // ✅ Check Redis cache first
        const cached = yield redis_config_1.redisClient.get(cacheKey);
        if (cached) {
            return response.status(200).json({
                status: 'success',
                message: 'Fetched from Redis cache',
                data: JSON.parse(cached)
            });
        }
        const userId = ((_a = request.user) === null || _a === void 0 ? void 0 : _a.id) || 'system';
        // ✅ Check MongoDB
        const exercisesFromDB = yield exercice_model_1.default.find({ target: normalizedTarget });
        if (exercisesFromDB.length > 0) {
            // Set cache asynchronously
            redis_config_1.redisClient.set(cacheKey, JSON.stringify(exercisesFromDB), { EX: 60 * 60 * 10 }).catch(console.error);
            return response.status(200).json({
                status: 'success',
                message: `Exercises fetched successfully from DB for target muscle: ${normalizedTarget}`,
                data: exercisesFromDB
            });
        }
        // ✅ Optional: Cache API result briefly to avoid repeated fetches (15 min)
        const apiCacheKey = `exercises:api:${normalizedTarget}`;
        const cachedAPI = yield redis_config_1.redisClient.get(apiCacheKey);
        let exercisesFromAPI;
        if (cachedAPI) {
            exercisesFromAPI = JSON.parse(cachedAPI);
        }
        else {
            const endpoint = `exercises/target/${normalizedTarget}`;
            exercisesFromAPI = (yield (0, exerciceDB_service_1.requestExerciseDB)({ endpoint }));
            if (!exercisesFromAPI || !Array.isArray(exercisesFromAPI) || exercisesFromAPI.length === 0) {
                return (0, error_service_1.sendError)(response, 404, 'No exercises found', `No exercises found for target muscle: ${normalizedTarget}`);
            }
            // Cache API response temporarily to reduce external calls
            redis_config_1.redisClient.set(apiCacheKey, JSON.stringify(exercisesFromAPI), { EX: 60 * 15 }).catch(console.error); // 15 minutes
        }
        // ✅ Bulk upsert (prevent duplicates)
        const operations = exercisesFromAPI.map((exercise) => ({
            updateOne: {
                filter: { name: exercise.name, bodyPart: exercise.bodyPart },
                update: {
                    $setOnInsert: Object.assign(Object.assign({}, exercise), { addedBy: userId, addedAt: new Date(), isManual: false })
                },
                upsert: true
            }
        }));
        const bulkResult = yield exercice_model_1.default.bulkWrite(operations, { ordered: false });
        // ✅ Refetch to return consistent data
        const allExercises = yield exercice_model_1.default.find({ target: normalizedTarget });
        // ✅ Set TTL based on manual entries
        const hasManual = allExercises.some((ex) => ex.isManual === true);
        const ttl = hasManual ? 60 * 60 * 2 : 60 * 60 * 10;
        redis_config_1.redisClient.set(cacheKey, JSON.stringify(allExercises), { EX: ttl }).catch(console.error);
        return response.status(201).json({
            status: 'success',
            message: `Exercises saved and returned for target muscle: ${normalizedTarget}`,
            insertedCount: bulkResult.upsertedCount || 0,
            data: allExercises
        });
    }
    catch (error) {
        console.error("getExercisesByTargetMuscle error:", error);
        return (0, error_service_1.sendError)(response, error.statusCode || 500, error.message || 'Internal Server Error', error.details || null);
    }
});
exports.getExercisesByTargetMuscle = getExercisesByTargetMuscle;
