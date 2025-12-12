import { Request, Response, NextFunction } from "express";
import { exerciseService } from "../services";



export const deleteExercise = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const deletedExercise = await exerciseService.deleteExercise(id);

        return res.status(200).json({
            ok: true,
            data: deletedExercise,
        });
    } catch (error) {
        next(error);
    }
};
