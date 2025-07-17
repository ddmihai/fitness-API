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
exports.createExercice = void 0;
const exercice_model_1 = __importDefault(require("../../../models/exercice.model"));
const error_service_1 = require("../../../helpers/http_responses/error.service");
const createExercice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, imageUrl, bodyPart, equipment, targetMuscle, secondaryMuscles, instructions, videoUrl, tags, focus, isBodyweight, description, difficulty, category, verified } = req.body;
        const addedBy = req.user;
        // Normalize name of the exercice
        const normalizeExerciceName = name.trim().toString();
        // check for duplicate of exercice
        const duplicate = yield exercice_model_1.default.findOne({ name: normalizeExerciceName });
        if (duplicate) {
            return res.status(409).json({
                message: "Exercice already exists",
                exerciceFallback: req.body
            });
        }
        ;
        // add into dtabase the exercice and check if the response of the database is ok to make sure of the insertion
        const addIntoDatabase = yield exercice_model_1.default.create({
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
            addedBy: addedBy === null || addedBy === void 0 ? void 0 : addedBy.userId
        });
        // Check if the exercice was added succesfully
        if (!addIntoDatabase) {
            return (0, error_service_1.sendError)(res, 500, "Something went wrong", 'Exercice has not been added');
        }
        ;
        return res.status(201).json({
            message: "Exercice added successfully",
            exercice: addIntoDatabase
        });
    }
    catch (error) {
        console.log(error);
        return (0, error_service_1.sendError)(res, 500, "Something went wrong", 'Exercice has not been added');
    }
});
exports.createExercice = createExercice;
