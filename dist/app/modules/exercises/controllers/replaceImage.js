"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceExerciseImage = replaceExerciseImage;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const AppError_1 = require("../../../errors/AppError");
const uploadImage_1 = require("./uploadImage");
const exerciseImage_storage_1 = require("../../storage/services/exerciseImage.storage");
async function replaceExerciseImage(req, res, next) {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            throw new AppError_1.AppError("Invalid exercise id", 400);
        if (!req.file)
            throw new AppError_1.AppError("No image uploaded", 400);
        const exercise = await models_1.Exercises.findById(id);
        if (!exercise)
            throw new AppError_1.AppError("Exercise not found", 404);
        // upload new first (safer), then delete old
        const compressed = await (0, uploadImage_1.compressExerciseImage)(req.file.buffer);
        const uploaded = await (0, exerciseImage_storage_1.uploadExerciseImage)({ exerciseId: id, buffer: compressed });
        const oldPath = exercise.imagePath;
        exercise.image = uploaded.publicUrl;
        exercise.imagePath = uploaded.path;
        await exercise.save();
        if (oldPath) {
            await (0, exerciseImage_storage_1.deleteExerciseImage)(oldPath);
        }
        return res.status(200).json({ ok: true, data: exercise });
    }
    catch (err) {
        next(err);
    }
}
