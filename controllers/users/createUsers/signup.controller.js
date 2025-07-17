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
const error_service_1 = require("../../../helpers/http_responses/error.service");
const users_1 = require("../../../dataAccessObject/users/users");
const user_model_1 = __importDefault(require("../../../models/user.model"));
const signupController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, firstName, lastName, email, password } = req.body;
        // normalize and sanitize input
        const normalizedUsername = username.toLowerCase().trim();
        const normalizedEmail = email.toLowerCase().trim();
        const sanitizedFirstName = firstName.toLowerCase().trim();
        const sanitizedLastName = lastName.toLowerCase().trim();
        // Check if email already exists
        const existingUser = yield (0, users_1.selectUserByEmail)(normalizedEmail);
        if (existingUser) {
            return (0, error_service_1.sendError)(res, 400, 'Email already exists', 'A user with this email already exists.');
        }
        // Check if username already exists
        const existingUsername = yield user_model_1.default.findOne({ username: normalizedUsername });
        if (existingUsername) {
            return (0, error_service_1.sendError)(res, 400, 'Username already exists', 'A user with this username already exists.');
        }
        // Create and save new user
        const createdUser = yield user_model_1.default.create({
            username: normalizedUsername,
            firstName: sanitizedFirstName,
            lastName: sanitizedLastName,
            email: normalizedEmail,
            avatar: 'https://www.gravatar.com/avatar/?d=mp&s=200',
            password
        });
        if (!createdUser || !createdUser._id) {
            return (0, error_service_1.sendError)(res, 500, 'User creation failed', 'Failed to create the user.');
        }
        // delete createdUser.password; // Remove password from response for security
        createdUser.password = ''; // Remove password for security
        return res.status(201).json({
            message: 'User created successfully',
            createdUser
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return (0, error_service_1.sendError)(res, 400, 'Duplicate field error', `The ${duplicateField} '${error.keyValue[duplicateField]}' is already in use.`);
        }
        return (0, error_service_1.sendError)(res, 500, 'Internal Server Error', error.message);
    }
});
exports.default = signupController;
