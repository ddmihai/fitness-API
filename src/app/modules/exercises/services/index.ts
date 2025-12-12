import mongoose from "mongoose";
import Exercises from "../models";
import { AppError } from "../../../errors/AppError";
import { CreateExerciseDTO } from "../types";


export const exerciseService = {

    async deleteExercise(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid exercise id", 400);
        }
        const exercise = await Exercises.findById(id);
        if (!exercise) {
            throw new AppError("Exercise not found", 404);
        }
        await exercise.deleteOne();
        return exercise;
    },

    async getExerciseById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid exercise id", 400);
        }
        const exercise = await Exercises.findById(id);
        if (!exercise) {
            throw new AppError("Exercise not found", 404);
        }
        return exercise;
    },



    async getExercises() {
        return Exercises.find({ isActive: true });
    },




    async createExercise(data: CreateExerciseDTO) {
        try {
            return await Exercises.create(data);
        } catch (err: any) {
            if (err?.code === 11000) {
                throw new AppError("Exercise already exists", 400);
            }
            throw err;
        }
    },
};
