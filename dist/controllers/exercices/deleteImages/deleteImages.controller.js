"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImagesFromExercice = void 0;
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const error_service_1 = require("../../../helpers/http_responses/error.service");
const mongoose_1 = __importDefault(require("mongoose"));
const exercice_model_1 = __importDefault(require("../../../models/exercice.model"));
const deleteImagesFromExercice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exerciceId, imageId } = req.params;
        //   validate params and body request
        if (!exerciceId || !imageId)
            return (0, error_service_1.sendError)(res, 400, 'Invalid parameters');
        // validate mongoose id for the exercice
        if (!mongoose_1.default.isValidObjectId(exerciceId) || !mongoose_1.default.isValidObjectId(imageId))
            return (0, error_service_1.sendError)(res, 400, 'Invalid ID(s) provided');
        // get the exercice and make sure it exists
        const exercice = yield exercice_model_1.default.findById(exerciceId);
        if (!exercice)
            return (0, error_service_1.sendError)(res, 404, 'Exercice not found');
        // get the image 
        const image = exercice.imageUrl.id(imageId); // Get image subdoc by _id
        if (!image)
            return (0, error_service_1.sendError)(res, 404, 'Image not found in exercice');
        // check if the image id is inside inside the exercice array
        const imageIndex = exercice.imageUrl.findIndex(img => img._id.toString() === imageId);
        if (imageIndex === -1)
            return (0, error_service_1.sendError)(res, 404, 'Image not found in exercice');
        // Delete from Cloudinary
        yield cloudinary_config_1.cloudinary.uploader.destroy(image.publicId);
        // Remove from MongoDB array
        image.deleteOne(); // Safe now because we checked it's not null
        yield exercice.save();
        res.status(200).json({ message: 'Image deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return (0, error_service_1.sendError)(res, 500, 'Failed to delete image');
    }
});
exports.deleteImagesFromExercice = deleteImagesFromExercice;
