import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
    MONGO_URI: string;
    REDIS_URL: string;
    JWT_SECRET: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSW: string;

    // cloudinary
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;

    // email
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_SECURE: string;
    SMTP_USER: string;
    SMTP_PASS: string;
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
    ADMIN_PASSW: getEnvVar("ADMIN_PASSW"),

    CLOUDINARY_API_KEY: getEnvVar("CLOUDINARY_API_KEY"),
    CLOUDINARY_API_SECRET: getEnvVar("CLOUDINARY_API_SECRET"),
    CLOUDINARY_CLOUD_NAME: getEnvVar("CLOUDINARY_CLOUD_NAME"),

    SMTP_HOST: getEnvVar("SMTP_HOST"),
    SMTP_PORT: parseInt(getEnvVar("SMTP_PORT")), // ✅ correct key & number conversion
    SMTP_SECURE: getEnvVar("SMTP_SECURE"),
    SMTP_USER: getEnvVar("SMTP_USER"),
    SMTP_PASS: getEnvVar("SMTP_PASS")
};



export default ENV as EnvConfig;
