import { Request, Response } from 'express';
import { cloudinary } from '../../../config/cloudinary.config';
import { sendError } from '../../../helpers/http_responses/error.service';
import mongoose from 'mongoose';
import Exercice from '../../../models/exercice.model';


export const deleteImagesFromExercice = async (req: Request, res: Response) => {
    try {
        const { exerciceId, imageId } = req.params;

        //   validate params and body request
        if (!exerciceId || !imageId)
            return sendError(res, 400, 'Invalid parameters');



        // validate mongoose id for the exercice
        if (!mongoose.isValidObjectId(exerciceId) || !mongoose.isValidObjectId(imageId))
            return sendError(res, 400, 'Invalid ID(s) provided');




        // get the exercice and make sure it exists
        const exercice = await Exercice.findById(exerciceId);
        if (!exercice) return sendError(res, 404, 'Exercice not found');



        // get the image 
        const image = exercice.imageUrl.id(imageId); // Get image subdoc by _id
        if (!image) return sendError(res, 404, 'Image not found in exercice');


        // check if the image id is inside inside the exercice array
        const imageIndex = exercice.imageUrl.findIndex(img => img._id.toString() === imageId);
        if (imageIndex === -1) return sendError(res, 404, 'Image not found in exercice');


        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // Remove from MongoDB array
        image.deleteOne(); // Safe now because we checked it's not null
        await exercice.save();

        res.status(200).json({ message: 'Image deleted successfully' });
    }

    catch (error) {
        console.error(error);
        return sendError(res, 500, 'Failed to delete image');
    }
}