import { Request, Response } from 'express';
import { sendError } from '../../../helpers/http_responses/error.service';
import Exercice from '../../../models/exercice.model';
import { cloudinary } from '../../../config/cloudinary.config';
import mongoose from 'mongoose';




export const uploadExerciceImages = async (req: Request, res: Response) => {
    try {
        const exerciceId = req.body.exerciceId;
        // check if there is a file
        if (!req.file) {
            return sendError(res, 400, 'No file uploaded. Please upload an image');
        }


        const publicId = req.file.filename ?? req.file.path.split('/').pop()?.split('.')[0];
        if (!publicId) {
            await cloudinary.uploader.destroy(req.file.filename || publicId);
            return sendError(res, 400, 'No public id found');
        }



        if (!exerciceId) {
            await cloudinary.uploader.destroy(req.file.filename || publicId);
            return sendError(res, 400, 'Exercice ID is required');
        }



        if (!mongoose.isValidObjectId(exerciceId)) {
            return sendError(res, 400, 'Invalid exercice ID format');
        }



        const imageUrl = req.file.path;

        // get the required exercice and check is it exists
        const exercice = await Exercice.findById(exerciceId);
        if (!exercice) {
            await cloudinary.uploader.destroy(req.file.filename || publicId);
            return sendError(res, 404, 'Exercice not found');
        }

        // update the exercice with the image url
        exercice.imageUrl.push({ url: imageUrl, publicId });
        await exercice.save();

        res.status(200).json({
            message: 'Upload successful!',
            imageUrl: req.file.path

        });

    }

    catch (error) {
        console.error(error);
        if (req.file?.filename) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        return sendError(res, 500, 'Failed to add images');
    }
}