"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../errors/AppError");
const env_1 = require("../config/env");
const errorHandler = (err, _req, res, _next) => {
    // Log the original error so you can debug
    console.error("🔥 Original error:", err);
    const e = err instanceof AppError_1.AppError
        ? err
        : new AppError_1.AppError(err instanceof Error ? err.message : "Internal server error", 500);
    const payload = {
        ok: false,
        message: e.message,
    };
    // In dev/test, include stack to debug
    if (env_1.env.NODE_ENV !== "production" && err instanceof Error) {
        payload.stack = err.stack;
    }
    res.status(e.statusCode).json(payload);
};
exports.errorHandler = errorHandler;
