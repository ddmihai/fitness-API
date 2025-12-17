"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressExerciseImage = compressExerciseImage;
exports.addExerciseImage = addExerciseImage;
const models_1 = __importDefault(require("../models"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = require("../../../errors/AppError");
const exerciseImage_storage_1 = require("../../storage/services/exerciseImage.storage");
const sharp_1 = __importDefault(require("sharp"));
async function compressExerciseImage(input) {
    return (0, sharp_1.default)(input)
        .rotate() // respects EXIF orientation
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
}
async function addExerciseImage(req, res, next) {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            throw new AppError_1.AppError("Invalid exercise id", 400);
        if (!req.file)
            throw new AppError_1.AppError("No image uploaded", 400);
        const exercise = await models_1.default.findById(id);
        if (!exercise)
            throw new AppError_1.AppError("Exercise not found", 404);
        const compressed = await compressExerciseImage(req.file.buffer);
        const uploaded = await (0, exerciseImage_storage_1.uploadExerciseImage)({ exerciseId: id, buffer: compressed });
        exercise.image = uploaded.publicUrl;
        exercise.imagePath = uploaded.path;
        await exercise.save();
        return res.status(200).json({ ok: true, data: exercise });
    }
    catch (err) {
        next(err);
    }
}
