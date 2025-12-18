"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = void 0;
const env_1 = require("../../../config/env");
const logoutUser = (_req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        return res.status(200).json({ ok: true, message: "Logout successful" });
    }
    catch (error) {
        next(error);
    }
};
exports.logoutUser = logoutUser;
