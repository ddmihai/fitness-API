"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDetails = exports.getUserDetails = exports.listUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_service_1 = require("../services/user.service");
const AppError_1 = require("../../../errors/AppError");
const allowedRoles = ["user", "admin", "collaborator"];
const sanitizeUser = (user) => {
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
const ensureValidObjectId = (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.AppError("Invalid user identifier", 400);
    }
    return id;
};
const listUsers = async (_req, res, next) => {
    try {
        const users = await user_service_1.UserService.getAllUsers();
        return res.status(200).json({
            ok: true,
            data: users.map(sanitizeUser),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.listUsers = listUsers;
const getUserDetails = async (req, res, next) => {
    try {
        const userId = ensureValidObjectId(req.params.id);
        const user = await user_service_1.UserService.getUserById(userId);
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        return res.status(200).json({ ok: true, data: sanitizeUser(user) });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserDetails = getUserDetails;
const updateUserDetails = async (req, res, next) => {
    try {
        const userId = ensureValidObjectId(req.params.id);
        const payload = {};
        if (typeof req.body.name === "string") {
            payload.name = req.body.name.trim();
        }
        if (typeof req.body.role === "string") {
            if (!allowedRoles.includes(req.body.role)) {
                throw new AppError_1.AppError("Invalid role provided", 400);
            }
            payload.role = req.body.role;
        }
        if (typeof req.body.isActive === "boolean") {
            payload.isActive = req.body.isActive;
        }
        if (Object.keys(payload).length === 0) {
            throw new AppError_1.AppError("No valid fields provided", 400);
        }
        const updatedUser = await user_service_1.UserService.updateUser(userId, payload);
        if (!updatedUser) {
            throw new AppError_1.AppError("User not found", 404);
        }
        return res.status(200).json({ ok: true, data: sanitizeUser(updatedUser) });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserDetails = updateUserDetails;
