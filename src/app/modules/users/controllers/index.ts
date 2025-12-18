import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { UserService } from "../services/user.service";
import { AppError } from "../../../errors/AppError";

const allowedRoles = ["user", "admin", "collaborator"] as const;

const sanitizeUser = (user: any) => {
    const plain = typeof user.toObject === "function" ? user.toObject() : user;
    return {
        id: plain._id?.toString(),
        name: plain.name,
        email: plain.email,
        role: plain.role,
        isActive: plain.isActive,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
    };
};

const ensureValidObjectId = (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid user identifier", 400);
    }
    return id;
};

export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getAllUsers();
        return res.status(200).json({
            ok: true,
            data: users.map(sanitizeUser),
        });
    } catch (error) {
        next(error);
    }
};

export const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ensureValidObjectId(req.params.id);
        const user = await UserService.getUserById(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return res.status(200).json({ ok: true, data: sanitizeUser(user) });
    } catch (error) {
        next(error);
    }
};

export const updateUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ensureValidObjectId(req.params.id);
        const payload: Record<string, unknown> = {};

        if (typeof req.body.name === "string") {
            payload.name = req.body.name.trim();
        }

        if (typeof req.body.role === "string") {
            if (!allowedRoles.includes(req.body.role)) {
                throw new AppError("Invalid role provided", 400);
            }
            payload.role = req.body.role;
        }

        if (typeof req.body.isActive === "boolean") {
            payload.isActive = req.body.isActive;
        }

        if (Object.keys(payload).length === 0) {
            throw new AppError("No valid fields provided", 400);
        }

        const updatedUser = await UserService.updateUser(userId, payload);
        if (!updatedUser) {
            throw new AppError("User not found", 404);
        }

        return res.status(200).json({ ok: true, data: sanitizeUser(updatedUser) });
    } catch (error) {
        next(error);
    }
};
