"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = __importDefault(require("../models"));
const AppError_1 = require("../../../errors/AppError");
exports.exerciseService = {
    async deleteExercise(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new AppError_1.AppError("Invalid exercise id", 400);
        }
        const exercise = await models_1.default.findById(id);
        if (!exercise) {
            throw new AppError_1.AppError("Exercise not found", 404);
        }
        await exercise.deleteOne();
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
};
