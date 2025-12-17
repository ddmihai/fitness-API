"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const models_1 = require("../models");
const AppError_1 = require("../../../errors/AppError");
const normalizeEmail = (email) => email.trim().toLowerCase();
const normalizeName = (name) => name.trim();
exports.UserService = {
    async getUserByEmailWithPassword(email) {
        if (!email)
            return null;
        return await models_1.User.findOne({ email: normalizeEmail(email) }).select("+password");
    },
    async getUserByEmail(email) {
        if (!email)
            return null;
        return await models_1.User.findOne({ email: normalizeEmail(email) });
    },
    async getAllUsers() {
        return await models_1.User.find();
    },
    async getUserById(id) {
        return await models_1.User.findById(id);
    },
    async updateUser(id, data) {
        return await models_1.User.findByIdAndUpdate(id, data, { new: true });
    },
    async deleteUser(id) {
        return await models_1.User.findByIdAndDelete(id);
    },
    async createUser(data) {
        const payload = {
            name: normalizeName(data.name),
            email: normalizeEmail(data.email),
            password: data.password, // hashed by pre-save
            role: data.role, // or omit if you don’t want callers setting it
        };
        try {
            const user = new models_1.User(payload);
            return await user.save();
        }
        catch (err) {
            // Duplicate key (email)
            if (err?.code === 11000) {
                throw new AppError_1.AppError("User already exists", 400);
            }
            throw err;
        }
    },
};
