import { Request, Response, NextFunction } from "express";
import { exerciseService } from "../services";



export const getAllExercices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allexercices = await exerciseService.getExercises();
        return res.status(200).json({
            ok: true,
            data: allexercices,
        });
    }
    catch (error) {
        next(error);
    }
};
