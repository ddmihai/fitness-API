import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
    RAPID_API_KEY: string;
    RAPID_API_HOST: string;
    MONGO_URI: string;
}



// Utility to validate required env vars
function getEnvVar(key: string, required = true): string {
    const value = process.env[key];

    if (!value && required) {
        console.error(`❌ Missing required environment variable: ${key}`);
        process.exit(1);
    }
    return value || "";
}


// Sanity check
const ENV = {
    MONGO_URI: getEnvVar("MONGO_URI"),
    RAPID_API_KEY: getEnvVar("RAPID_API_KEY"),
    RAPID_API_HOST: getEnvVar("RAPID_API_HOST"),
};


export default ENV as EnvConfig;
