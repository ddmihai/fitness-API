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
exports.uploadExerciceImages = void 0;
const error_service_1 = require("../../../helpers/http_responses/error.service");
const exercice_model_1 = __importDefault(require("../../../models/exercice.model"));
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const mongoose_1 = __importDefault(require("mongoose"));
const uploadExerciceImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const exerciceId = req.body.exerciceId;
        // check if there is a file
        if (!req.file) {
            return (0, error_service_1.sendError)(res, 400, 'No file uploaded. Please upload an image');
        }
        const publicId = (_a = req.file.filename) !== null && _a !== void 0 ? _a : (_b = req.file.path.split('/').pop()) === null || _b === void 0 ? void 0 : _b.split('.')[0];
        if (!publicId) {
            yield cloudinary_config_1.cloudinary.uploader.destroy(req.file.filename || publicId);
            return (0, error_service_1.sendError)(res, 400, 'No public id found');
        }
        if (!exerciceId) {
            yield cloudinary_config_1.cloudinary.uploader.destroy(req.file.filename || publicId);
            return (0, error_service_1.sendError)(res, 400, 'Exercice ID is required');
        }
        if (!mongoose_1.default.isValidObjectId(exerciceId)) {
            return (0, error_service_1.sendError)(res, 400, 'Invalid exercice ID format');
        }
        const imageUrl = req.file.path;
        // get the required exercice and check is it exists
        const exercice = yield exercice_model_1.default.findById(exerciceId);
        if (!exercice) {
            yield cloudinary_config_1.cloudinary.uploader.destroy(req.file.filename || publicId);
            return (0, error_service_1.sendError)(res, 404, 'Exercice not found');
        }
        // update the exercice with the image url
        exercice.imageUrl.push({ url: imageUrl, publicId });
        yield exercice.save();
        res.status(200).json({
            message: 'Upload successful!',
            imageUrl: req.file.path
        });
    }
    catch (error) {
        console.error(error);
        if ((_c = req.file) === null || _c === void 0 ? void 0 : _c.filename) {
            yield cloudinary_config_1.cloudinary.uploader.destroy(req.file.filename);
        }
        return (0, error_service_1.sendError)(res, 500, 'Failed to add images');
    }
});
exports.uploadExerciceImages = uploadExerciceImages;
