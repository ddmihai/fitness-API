"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const workoutValidationSchema = [
    (0, express_validator_1.body)('name')
        .notEmpty().withMessage('Workout name is required')
        .isString().withMessage('Workout name must be a string')
        .trim()
        .toLowerCase()
        .isLength({ max: 100 }).withMessage('Workout name must be at most 100 characters'),
    (0, express_validator_1.body)('exercises')
        .isArray({ min: 1 }).withMessage('Exercises must be a non-empty array'),
    (0, express_validator_1.body)('exercises.*.exercise')
        .notEmpty().withMessage('Exercise ID is required')
        .isMongoId().withMessage('Exercise must be a valid MongoDB ObjectId'),
    (0, express_validator_1.body)('exercises.*.order')
        .notEmpty().withMessage('Exercise order is required')
        .isInt({ min: 1 }).withMessage('Order must be an integer greater than 0'),
    (0, express_validator_1.body)('exercises.*.sets')
        .notEmpty().withMessage('Number of sets is required')
        .isInt({ min: 1 }).withMessage('Sets must be an integer greater than 0'),
    (0, express_validator_1.body)('exercises.*.reps')
        .notEmpty().withMessage('Reps are required')
        .isString().withMessage('Reps must be a string')
        .trim(),
    (0, express_validator_1.body)('exercises.*.rest')
        .notEmpty().withMessage('Rest time is required')
        .isInt({ min: 0 }).withMessage('Rest must be a non-negative integer'),
    (0, express_validator_1.body)('exercises.*.notes')
        .optional()
        .isString().withMessage('Notes must be a string')
        .trim(),
];
exports.default = workoutValidationSchema;
