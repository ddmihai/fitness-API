import { Request, Response, NextFunction } from "express";
import { exerciseService } from "../services";


export const createExercise = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, muscleGroups, category, image, equipment } = req.body;

        const exercise = await exerciseService.createExercise({
            name,
            description,
            image,
            muscleGroups,
            category,
            equipment,
        });

        return res.status(201).json({
            ok: true,
            data: exercise,
        });
    }

    catch (error) {
        next(error);
    }
};
