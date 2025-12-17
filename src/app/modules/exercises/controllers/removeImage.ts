import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Exercises } from "../models";
import { AppError } from "../../../errors/AppError";
import { deleteExerciseImage } from "../../storage/services/exerciseImage.storage";

export async function removeExerciseImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid exercise id", 400);
        }

        const exercise = await Exercises.findById(id);
        if (!exercise) {
            throw new AppError("Exercise not found", 404);
        }

        if (!exercise.imagePath) {
            throw new AppError("Exercise has no image to delete", 400);
        }

        await deleteExerciseImage(exercise.imagePath);

        exercise.image = undefined;
        exercise.imagePath = undefined;
        await exercise.save();

        return res.status(200).json({ ok: true, data: exercise });
    } catch (error) {
        next(error);
    }
}
