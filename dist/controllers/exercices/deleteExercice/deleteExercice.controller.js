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
exports.deleteExercice = void 0;
const error_service_1 = require("../../../helpers/http_responses/error.service");
const mongoose_1 = __importDefault(require("mongoose"));
const exercice_model_1 = __importDefault(require("../../../models/exercice.model"));
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const deleteExercice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exerciceId } = req.params;
        // validate exercice id
        if (!exerciceId)
            return (0, error_service_1.sendError)(res, 400, 'Exercice id is required');
        // make sure the id is a valid mongoose id
        if (!mongoose_1.default.Types.ObjectId.isValid(exerciceId))
            return (0, error_service_1.sendError)(res, 400, 'Invalid exercice id');
        // check for the images and if any exists, remove the iamges and delete the exercice
        const exercice = yield exercice_model_1.default.findById(exerciceId);
        if (!exercice)
            return (0, error_service_1.sendError)(res, 404, 'Exercice not found');
        // if there is no image presented in the array, just delete the exercice
        if (exercice.imageUrl.length === 0) {
            yield exercice_model_1.default.findByIdAndDelete(exerciceId);
            return res.status(200).json({ message: 'Exercice deleted successfully' });
        }
        ;
        // Delete all images if any
        if (Array.isArray(exercice.imageUrl) && exercice.imageUrl.length > 0) {
            for (const img of exercice.imageUrl) {
                if (img.publicId) {
                    yield cloudinary_config_1.cloudinary.uploader.destroy(img.publicId);
                }
            }
        }
        // Delete the exercice
        yield exercice_model_1.default.findByIdAndDelete(exerciceId);
        return res.status(200).json({ message: 'Exercice deleted successfully' });
    }
    catch (error) {
        console.log(error);
        return (0, error_service_1.sendError)(res, 500, 'Internal server error. The exercice has not been removed!');
    }
});
exports.deleteExercice = deleteExercice;
