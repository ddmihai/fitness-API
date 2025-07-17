import { Request, Response } from "express";
import Exercice from "../../../models/exercice.model";
import { sendError } from "../../../helpers/http_responses/error.service";

interface AuthRequest extends Request {
    user?: { userId: string; role: string[] };
}

export const createExercice = async (req: AuthRequest, res: Response) => {
    try {
        const {
            name,
            imageUrl,
            bodyPart,
            equipment,
            targetMuscle,
            secondaryMuscles,
            instructions,
            videoUrl,
            tags,
            focus,
            isBodyweight,
            description,
            difficulty,
            category,
            verified
        } = req.body;

        const addedBy = req.user;

        // Normalize name of the exercice
        const normalizeExerciceName = name.trim().toString();

        // check for duplicate of exercice
        const duplicate = await Exercice.findOne({ name: normalizeExerciceName });

        if (duplicate) {
            return res.status(409).json({
                message: "Exercice already exists",
                exerciceFallback: req.body
            });
        };


        // add into dtabase the exercice and check if the response of the database is ok to make sure of the insertion
        const addIntoDatabase = await Exercice.create({
            name: normalizeExerciceName,
            imageUrl,
            bodyPart,
            equipment,
            targetMuscle,
            secondaryMuscles,
            instructions,
            videoUrl,
            tags,
            focus,
            isBodyweight,
            description,
            difficulty,
            category,
            verified,
            addedBy: addedBy?.userId
        });

        // Check if the exercice was added succesfully
        if (!addIntoDatabase) {
            return sendError(res, 500, "Something went wrong", 'Exercice has not been added');
        };

        return res.status(201).json({
            message: "Exercice added successfully",
            exercice: addIntoDatabase
        });

    }
    catch (error) {
        console.log(error);
        return sendError(res, 500, "Something went wrong", 'Exercice has not been added');
    }
}