"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = __importDefault(require("../models"));
const AppError_1 = require("../../../errors/AppError");
const exerciseImage_storage_1 = require("../../storage/services/exerciseImage.storage");
exports.exerciseService = {
    async deleteExercise(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new AppError_1.AppError("Invalid exercise id", 400);
        }
        const exercise = await models_1.default.findById(id);
        if (!exercise) {
            throw new AppError_1.AppError("Exercise not found", 404);
        }
        const imagePath = exercise.imagePath;
        await exercise.deleteOne();
        if (imagePath) {
            try {
                await (0, exerciseImage_storage_1.deleteExerciseImage)(imagePath);
            }
            catch (error) {
                console.error("Failed to delete exercise image:", error);
            }
        }
        return exercise;
    },
    async getExerciseById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new AppError_1.AppError("Invalid exercise id", 400);
        }
        const exercise = await models_1.default.findById(id);
        if (!exercise) {
            throw new AppError_1.AppError("Exercise not found", 404);
        }
        return exercise;
    },
    async getExercises() {
        return models_1.default.find({ isActive: true });
    },
    async createExercise(data) {
        try {
            return await models_1.default.create(data);
        }
        catch (err) {
            if (err?.code === 11000) {
                throw new AppError_1.AppError("Exercise already exists", 400);
            }
            throw err;
        }
    },
    async updateExercise(id, data) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new AppError_1.AppError("Invalid exercise id", 400);
        }
        const payload = {};
        if (typeof data.name === "string")
            payload.name = data.name;
        if (typeof data.description === "string")
            payload.description = data.description;
        if (Array.isArray(data.muscleGroups))
            payload.muscleGroups = data.muscleGroups;
        if (Array.isArray(data.category))
            payload.category = data.category;
        if (Array.isArray(data.equipment))
            payload.equipment = data.equipment;
        if (Object.keys(payload).length === 0) {
            throw new AppError_1.AppError("No valid fields provided", 400);
        }
        const updated = await models_1.default.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            throw new AppError_1.AppError("Exercise not found", 404);
        }
        return updated;
    },
};
