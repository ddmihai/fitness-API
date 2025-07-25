"use strict";
// src/config/redis.config.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction && process.env.REDIS_URL) {
    console.warn("⚠️ Warning: REDIS_URL is set in development! Make sure you're not using production Redis.");
}
// dw
exports.redisClient = (0, redis_1.createClient)({
    url: isProduction
        ? process.env.REDIS_URL
        : 'redis://127.0.0.1:6379',
});
exports.redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error', err);
});
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.redisClient.connect();
        console.log('✅ Connected to Redis');
    }
    catch (err) {
        console.error('❌ Redis connection failed', err);
    }
});
exports.connectRedis = connectRedis;
