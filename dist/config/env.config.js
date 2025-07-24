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
    ADMIN_PASSW: getEnvVar("ADMIN_PASSW"),
    CLOUDINARY_API_KEY: getEnvVar("CLOUDINARY_API_KEY"),
    CLOUDINARY_API_SECRET: getEnvVar("CLOUDINARY_API_SECRET"),
    CLOUDINARY_CLOUD_NAME: getEnvVar("CLOUDINARY_CLOUD_NAME"),
    SMTP_HOST: getEnvVar("SMTP_HOST"),
    SMTP_PORT: parseInt(getEnvVar("SMTP_PORT")), // ✅ correct key & number conversion
    SMTP_SECURE: getEnvVar("SMTP_SECURE"),
    SMTP_USER: getEnvVar("SMTP_USER"),
    SMTP_PASS: getEnvVar("SMTP_PASS"),
    MONGO_URI_PRODUCTION: getEnvVar("MONGO_URI_PRODUCTION")
};
exports.default = ENV;
