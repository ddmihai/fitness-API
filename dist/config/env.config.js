"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Utility to validate required env vars
function getEnvVar(key, required = true) {
    const value = process.env[key];
    if (!value && required) {
        console.error(`❌ Missing required environment variable: ${key}`);
        process.exit(1);
    }
    return (value === null || value === void 0 ? void 0 : value.trim()) || "";
}
// Sanity check
const ENV = {
    MONGO_URI: getEnvVar("MONGO_URI"),
    REDIS_URL: getEnvVar("REDIS_URL"),
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    ADMIN_EMAIL: getEnvVar("ADMIN_EMAIL"),
    ADMIN_PASSW: getEnvVar("ADMIN_PASSW")
};
exports.default = ENV;
