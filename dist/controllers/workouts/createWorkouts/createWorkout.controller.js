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
exports.createWorkout = void 0;
const error_service_1 = require("../../../helpers/http_responses/error.service");
const workoutSchema_model_1 = require("../../../models/workoutSchema.model");
const exercice_model_1 = __importDefault(require("../../../models/exercice.model"));
const createWorkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return (0, error_service_1.sendError)(res, 401, 'Unauthorized', 'User not authenticated');
        const { name, exercises } = req.body;
        const userId = req.user.userId;
        // Validator function inside the controller:
        const hasDuplicates = (exs) => {
            const exerciseIds = exs.map(e => e.exercise.toString());
            return new Set(exerciseIds).size !== exerciseIds.length;
        };
        if (hasDuplicates(exercises)) {
            return (0, error_service_1.sendError)(res, 400, 'Validation Error', 'Duplicate exercises detected in workout');
        }
        const exerciseIds = exercises.map((e) => e.exercise.toString());
        // Query DB for all exercises with those IDs
        const foundExercises = yield exercice_model_1.default.find({ _id: { $in: exerciseIds } }).select('_id');
        // Check if all IDs exist
        if (foundExercises.length !== exerciseIds.length) {
            return (0, error_service_1.sendError)(res, 400, 'Validation Error', 'One or more exercises do not exist');
        }
        // Create new workout instance
        const newWorkout = new workoutSchema_model_1.Workout({
            name,
            createdBy: userId,
            exercises: exercises.map((exercise, index) => (Object.assign(Object.assign({}, exercise), { order: index + 1 }))),
        });
        // Save workout to DB
        yield newWorkout.save();
        return res.status(201).json({
            message: 'Workout created successfully'
        });
    }
    // handle errors
    catch (error) {
        if (error instanceof Error) {
            console.error('Error creating workout:', error.message);
            return (0, error_service_1.sendError)(res, 500, 'Error creating workout', error.message);
        }
        console.error('Unknown error:', error);
        return (0, error_service_1.sendError)(res, 500, 'Unknown error', 'An unknown error occurred');
    }
});
exports.createWorkout = createWorkout;
