
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Exercises } from '../models';
import { AppError } from '../../../errors/AppError';
import { compressExerciseImage } from './uploadImage';
import { deleteExerciseImage, uploadExerciseImage } from '../../storage/services/exerciseImage.storage';


export async function replaceExerciseImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid exercise id", 400);
        if (!req.file) throw new AppError("No image uploaded", 400);

        const exercise = await Exercises.findById(id);
        if (!exercise) throw new AppError("Exercise not found", 404);

        // upload new first (safer), then delete old
        const compressed = await compressExerciseImage(req.file.buffer);
        const uploaded = await uploadExerciseImage({ exerciseId: id, buffer: compressed });

        const oldPath = exercise.imagePath;

        exercise.image = uploaded.publicUrl;
        exercise.imagePath = uploaded.path;
        await exercise.save();

        if (oldPath) {
            await deleteExerciseImage(oldPath);
        }

        return res.status(200).json({ ok: true, data: exercise });
    } catch (err) {
        next(err);
    }
}
