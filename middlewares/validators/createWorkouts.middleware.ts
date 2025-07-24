import { body } from 'express-validator';

const workoutValidationSchema = [
    body('name')
        .notEmpty().withMessage('Workout name is required')
        .isString().withMessage('Workout name must be a string')
        .trim()
        .toLowerCase()
        .isLength({ max: 100 }).withMessage('Workout name must be at most 100 characters'),

    body('exercises')
        .isArray({ min: 1 }).withMessage('Exercises must be a non-empty array'),

    body('exercises.*.exercise')
        .notEmpty().withMessage('Exercise ID is required')
        .isMongoId().withMessage('Exercise must be a valid MongoDB ObjectId'),

    body('exercises.*.order')
        .notEmpty().withMessage('Exercise order is required')
        .isInt({ min: 1 }).withMessage('Order must be an integer greater than 0'),

    body('exercises.*.sets')
        .notEmpty().withMessage('Number of sets is required')
        .isInt({ min: 1 }).withMessage('Sets must be an integer greater than 0'),

    body('exercises.*.reps')
        .notEmpty().withMessage('Reps are required')
        .isString().withMessage('Reps must be a string')
        .trim(),

    body('exercises.*.rest')
        .notEmpty().withMessage('Rest time is required')
        .isInt({ min: 0 }).withMessage('Rest must be a non-negative integer'),

    body('exercises.*.notes')
        .optional()
        .isString().withMessage('Notes must be a string')
        .trim(),
];


export default workoutValidationSchema;