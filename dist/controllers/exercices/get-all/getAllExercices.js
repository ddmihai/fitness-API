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
exports.getAllExercices = void 0;
const redis_config_1 = require("../../../config/redis.config");
const error_service_1 = require("../../../helpers/http_responses/error.service");
const exercice_model_1 = __importDefault(require("../../../models/exercice.model"));
const getAllExercices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse page and limit from query params, with defaults
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;
        // Create a unique cache key based on pagination params
        const cacheKey = `exercices:page:${page}:limit:${limit}`;
        // Attempt to get cached data from Redis
        const cachedData = yield redis_config_1.redisClient.get(cacheKey);
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            return res.status(200).json(Object.assign(Object.assign({}, parsedData), { fromCache: true }));
        }
        // Cache miss — query DB
        const totalCount = yield exercice_model_1.default.countDocuments();
        const exercices = yield exercice_model_1.default.find()
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
        yield redis_config_1.redisClient.set(cacheKey, JSON.stringify(responsePayload), { EX: 300 });
        // Return fresh data
        return res.status(200).json(responsePayload);
    }
    catch (error) {
        if (error instanceof Error) {
            return (0, error_service_1.sendError)(res, 500, error.message, 'Error querying exercices');
        }
        return (0, error_service_1.sendError)(res, 500, 'Unknown error querying exercices');
    }
});
exports.getAllExercices = getAllExercices;
