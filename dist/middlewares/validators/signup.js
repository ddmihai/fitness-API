"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignupValidationSchema = void 0;
const express_validator_1 = require("express-validator");
exports.userSignupValidationSchema = [
    (0, express_validator_1.body)('username')
        .notEmpty().withMessage('Username is required')
        .toLowerCase() // sanitize: convert to lowercase automatically
        .trim()
        .escape(), // sanitize: escape HTML chars
    (0, express_validator_1.body)('firstName')
        .notEmpty().withMessage('First name is required')
        .trim()
        .escape() // sanitize: escape HTML entities to prevent XSS
        .matches(/^[A-Za-z]+$/).withMessage('First name must contain only letters'),
    (0, express_validator_1.body)('lastName')
        .notEmpty().withMessage('Last name is required')
        .trim()
        .escape()
        .matches(/^[A-Za-z]+$/).withMessage('Last name must contain only letters'),
    (0, express_validator_1.body)('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .normalizeEmail(), // sanitize: normalize email
    (0, express_validator_1.body)('avatar')
        .optional()
        .isURL().withMessage('Avatar must be a valid URL')
        .trim()
        .escape(),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
        .matches(/\d/).withMessage('Password must contain a number'),
];
