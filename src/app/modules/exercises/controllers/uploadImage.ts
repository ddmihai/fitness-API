import { Request, Response, NextFunction } from "express";
import Exercises from "../models";
import mongoose from "mongoose";
import { AppError } from "../../../errors/AppError";
import { uploadExerciseImage } from "../../storage/services/exerciseImage.storage";
import sharp from "sharp";

export async function compressExerciseImage(input: Buffer) {
    return sharp(input)
        .rotate() // respects EXIF orientation
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
}




export async function addExerciseImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid exercise id", 400);
        if (!req.file) throw new AppError("No image uploaded", 400);

        const exercise = await Exercises.findById(id);
        if (!exercise) throw new AppError("Exercise not found", 404);

        const compressed = await compressExerciseImage(req.file.buffer);
        const uploaded = await uploadExerciseImage({ exerciseId: id, buffer: compressed });

        exercise.image = uploaded.publicUrl;
        exercise.imagePath = uploaded.path;
        await exercise.save();

        return res.status(200).json({ ok: true, data: exercise });
    } catch (err) {
        next(err);
    }
}
