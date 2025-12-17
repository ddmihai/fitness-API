import { NextFunction, Request, Response } from "express";
import { exerciseService } from "../services";

export const updateExercise = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, description, muscleGroups, category, equipment } = req.body;

        const updated = await exerciseService.updateExercise(id, {
            name,
            description,
            muscleGroups,
            category,
            equipment,
        });

        return res.status(200).json({ ok: true, data: updated });
    } catch (error) {
        next(error);
    }
};
