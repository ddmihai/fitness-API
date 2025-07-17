import { body } from "express-validator";

export const exerciseValidationSchema = [
    body("name")
        .notEmpty().withMessage("Name is required")
        .isString().withMessage("Name must be a string")
        .toLowerCase()
        .trim()
        .escape(),

    body("imageUrl")
        .isArray({ min: 1 }).withMessage("imageUrl must be a non-empty array")
        .custom((urls: string[]) => urls.every(url => /^https?:\/\/.+/.test(url)))
        .withMessage("Each image must be a valid URL"),

    body("bodyPart")
        .notEmpty().withMessage("Body part is required")
        .isString()
        .toLowerCase()
        .trim()
        .escape(),

    body("equipment")
        .notEmpty().withMessage("Equipment is required")
        .isString()
        .toLowerCase()
        .trim()
        .escape(),

    body("targetMuscle")
        .notEmpty().withMessage("Target muscle is required")
        .isString()
        .toLowerCase()
        .trim()
        .escape(),

    body("secondaryMuscles")
        .optional()
        .isArray().withMessage("secondaryMuscles must be an array of strings"),

    body("instructions")
        .optional()
        .isArray().withMessage("instructions must be an array of strings"),

    body("videoUrl")
        .optional()
        .isString()
        .trim()
        .custom((url) => /^https?:\/\/.+/.test(url))
        .withMessage("Video URL must be valid"),

    body("tags")
        .isArray({ min: 1 }).withMessage("Tags must be a non-empty array"),

    body("focus")
        .notEmpty().withMessage("Focus is required")
        .isIn(["strength", "hypertrophy", "mobility", "rehab", "cardio"])
        .withMessage("Focus must be one of: strength, hypertrophy, mobility, rehab, cardio")
        .toLowerCase()
        .trim()
        .escape(),

    body("isBodyweight")
        .notEmpty().withMessage("isBodyweight is required")
        .isBoolean().withMessage("isBodyweight must be a boolean"),

    body("description")
        .optional()
        .isString()
        .toLowerCase()
        .trim()
        .escape(),

    body("difficulty")
        .optional()
        .isIn(["beginner", "intermediate", "advanced"])
        .withMessage("Invalid difficulty level")
        .toLowerCase()
        .trim()
        .escape(),

    body("category")
        .optional()
        .isIn(["gym", "home"])
        .withMessage("Category must be 'gym' or 'home'")
        .toLowerCase()
        .trim()
        .escape()
];
