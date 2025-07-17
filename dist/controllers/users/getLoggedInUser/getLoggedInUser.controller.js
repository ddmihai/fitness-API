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
exports.getLoggedinUser = void 0;
const user_model_1 = __importDefault(require("../../../models/user.model"));
const error_service_1 = require("../../../helpers/http_responses/error.service");
const redis_config_1 = require("../../../config/redis.config");
const getLoggedinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const cacheKey = `user:${user.userId}`;
        // 1. Check cache
        const cachedUser = yield redis_config_1.redisClient.get(cacheKey);
        if (cachedUser) {
            return res.status(200).json({
                status: 'success (from cache)',
                data: JSON.parse(cachedUser),
            });
        }
        // 2. Fallback to DB
        const requestedUser = yield user_model_1.default.findById(user.userId).select('-password');
        if (!requestedUser) {
            return (0, error_service_1.sendError)(res, 404, 'User not found', 'User not found');
        }
        // 3. Cache result (safe stringify)
        yield redis_config_1.redisClient.set(cacheKey, JSON.stringify(requestedUser), { EX: 3600 });
        return res.status(200).json({
            status: 'success',
            data: requestedUser,
        });
    }
    catch (error) {
        console.error('Get logged-in user error:', error);
        return (0, error_service_1.sendError)(res, 500, 'Internal server error', 'Something went wrong');
    }
});
exports.getLoggedinUser = getLoggedinUser;
