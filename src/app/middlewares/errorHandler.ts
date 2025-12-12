import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    // Log the original error so you can debug
    console.error("🔥 Original error:", err);

    const e =
        err instanceof AppError
            ? err
            : new AppError(err instanceof Error ? err.message : "Internal server error", 500);

    const payload: any = {
        ok: false,
        message: e.message,
    };

    // In dev/test, include stack to debug
    if (env.NODE_ENV !== "production" && err instanceof Error) {
        payload.stack = err.stack;
    }

    res.status(e.statusCode).json(payload);
};
