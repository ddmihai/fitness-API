import dotenv from "dotenv";
dotenv.config();

const required = (key: string) => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing env var: ${key}`);
    return value;
};

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 3000),
    MONGO_URI: required("MONGO_URI"),
    JWT_SECRET: required("JWT_SECRET")
} as const;
