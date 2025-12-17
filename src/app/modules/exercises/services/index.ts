import mongoose from "mongoose";
import Exercises from "../models";
import { AppError } from "../../../errors/AppError";
import { CreateExerciseDTO } from "../types";
import { deleteExerciseImage } from "../../storage/services/exerciseImage.storage";


export const exerciseService = {

    async deleteExercise(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid exercise id", 400);
        }
        const exercise = await Exercises.findById(id);
        if (!exercise) {
            throw new AppError("Exercise not found", 404);
        }
        const imagePath = exercise.imagePath;
        await exercise.deleteOne();

        if (imagePath) {
            try {
                await deleteExerciseImage(imagePath);
            } catch (error) {
                console.error("Failed to delete exercise image:", error);
            }
        }

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

    async updateExercise(id: string, data: Partial<CreateExerciseDTO>) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid exercise id", 400);
        }

        const payload: Partial<CreateExerciseDTO> = {};
        if (typeof data.name === "string") payload.name = data.name;
        if (typeof data.description === "string") payload.description = data.description;
        if (Array.isArray(data.muscleGroups)) payload.muscleGroups = data.muscleGroups;
        if (Array.isArray(data.category)) payload.category = data.category;
        if (Array.isArray(data.equipment)) payload.equipment = data.equipment;

        if (Object.keys(payload).length === 0) {
            throw new AppError("No valid fields provided", 400);
        }

        const updated = await Exercises.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            throw new AppError("Exercise not found", 404);
        }

        return updated;
    },
};
