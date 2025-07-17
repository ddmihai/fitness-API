import dotenv from "dotenv";
import { get } from "http";
dotenv.config();

interface EnvConfig {
    MONGO_URI: string;
    REDIS_URL: string;
    JWT_SECRET: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSW: string;
}



// Utility to validate required env vars
function getEnvVar(key: string, required = true): string {
    const value = process.env[key];

    if (!value && required) {
        console.error(`❌ Missing required environment variable: ${key}`);
        process.exit(1);
    }
    return value?.trim() || "";
}


// Sanity check
const ENV = {
    MONGO_URI: getEnvVar("MONGO_URI"),
    REDIS_URL: getEnvVar("REDIS_URL"),
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    ADMIN_EMAIL: getEnvVar("ADMIN_EMAIL"),
    ADMIN_PASSW: getEnvVar("ADMIN_PASSW")
};


export default ENV as EnvConfig;
