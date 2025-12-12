import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

const keyGen = (req: Request) => {
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    return ipKeyGenerator(ip);
};

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyGen,
    message: { ok: false, message: "Too many requests. Please try again later." },
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyGen,
    message: { ok: false, message: "Too many auth attempts. Try again later." },
});

export const sensitiveLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyGen,
    message: { ok: false, message: "Too many requests for this action. Try again later." },
});
