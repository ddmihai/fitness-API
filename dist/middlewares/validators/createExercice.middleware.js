"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseValidationSchema = void 0;
const express_validator_1 = require("express-validator");
exports.exerciseValidationSchema = [
    (0, express_validator_1.body)("name")
        .notEmpty().withMessage("Name is required")
        .isString().withMessage("Name must be a string")
        .toLowerCase()
        .trim()
        .escape(),
    (0, express_validator_1.body)('imageUrl')
        .isArray()
        .optional()
        .withMessage('imageUrl must be a non-empty array')
        .custom((images) => images.every(img => typeof img.url === 'string' &&
        /^https?:\/\/.+/.test(img.url) &&
        typeof img.publicId === 'string' &&
        img.publicId.trim().length > 0))
        .withMessage('Each image must have a valid url and a non-empty publicId'),
    (0, express_validator_1.body)("bodyPart")
        .notEmpty().withMessage("Body part is required")
        .isString()
        .toLowerCase()
        .trim()
        .escape(),
    (0, express_validator_1.body)("equipment")
        .notEmpty().withMessage("Equipment is required")
        .isString()
        .toLowerCase()
        .trim()
        .escape(),
    (0, express_validator_1.body)("targetMuscle")
        .notEmpty().withMessage("Target muscle is required")
        .isString()
        .toLowerCase()
        .trim()
        .escape(),
    (0, express_validator_1.body)("secondaryMuscles")
        .optional()
        .isArray().withMessage("secondaryMuscles must be an array of strings"),
    (0, express_validator_1.body)("instructions")
        .optional()
        .isArray().withMessage("instructions must be an array of strings"),
    (0, express_validator_1.body)("videoUrl")
        .optional()
        .isString()
        .trim()
        .custom((url) => /^https?:\/\/.+/.test(url))
        .withMessage("Video URL must be valid"),
    (0, express_validator_1.body)("tags")
        .isArray({ min: 1 }).withMessage("Tags must be a non-empty array"),
    (0, express_validator_1.body)("focus")
        .notEmpty().withMessage("Focus is required")
        .isIn(["strength", "hypertrophy", "mobility", "rehab", "cardio"])
        .withMessage("Focus must be one of: strength, hypertrophy, mobility, rehab, cardio")
        .toLowerCase()
        .trim()
        .escape(),
    (0, express_validator_1.body)("isBodyweight")
        .notEmpty().withMessage("isBodyweight is required")
        .isBoolean().withMessage("isBodyweight must be a boolean"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .toLowerCase()
        .trim()
        .escape(),
    (0, express_validator_1.body)("difficulty")
        .optional()
        .isIn(["beginner", "intermediate", "advanced"])
        .withMessage("Invalid difficulty level")
        .toLowerCase()
        .trim()
        .escape(),
    (0, express_validator_1.body)("category")
        .optional()
        .isIn(["gym", "home"])
        .withMessage("Category must be 'gym' or 'home'")
        .toLowerCase()
        .trim()
        .escape()
];
