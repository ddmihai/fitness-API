import { Request, Response } from "express";
import { sendError } from "../../../helpers/http_responses/error.service";
import mongoose from "mongoose";
import Exercice from "../../../models/exercice.model";
import { cloudinary } from '../../../config/cloudinary.config';


export const deleteExercice = async (req: Request, res: Response) => {
    try {
        const { exerciceId } = req.params;

        // validate exercice id
        if (!exerciceId)
            return sendError(res, 400, 'Exercice id is required');

        // make sure the id is a valid mongoose id
        if (!mongoose.Types.ObjectId.isValid(exerciceId))
            return sendError(res, 400, 'Invalid exercice id');


        // check for the images and if any exists, remove the iamges and delete the exercice
        const exercice = await Exercice.findById(exerciceId);

        if (!exercice)
            return sendError(res, 404, 'Exercice not found');

        // if there is no image presented in the array, just delete the exercice
        if (exercice.imageUrl.length === 0) {
            await Exercice.findByIdAndDelete(exerciceId);
            return res.status(200).json({ message: 'Exercice deleted successfully' });
        };

        // Delete all images if any
        if (Array.isArray(exercice.imageUrl) && exercice.imageUrl.length > 0) {
            for (const img of exercice.imageUrl) {
                if (img.publicId) {
                    await cloudinary.uploader.destroy(img.publicId);
                }
            }
        }

        // Delete the exercice
        await Exercice.findByIdAndDelete(exerciceId);
        return res.status(200).json({ message: 'Exercice deleted successfully' });
    }
    catch (error) {
        console.log(error);
        return sendError(res, 500, 'Internal server error. The exercice has not been removed!');
    }
}