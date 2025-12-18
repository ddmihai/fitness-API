import { NextFunction, Request, Response } from "express";
import { env } from "../../../config/env";

export const logoutUser = (_req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return res.status(200).json({ ok: true, message: "Logout successful" });
    } catch (error) {
        next(error);
    }
};
