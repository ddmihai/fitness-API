"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signup_controller_1 = __importDefault(require("../controllers/users/createUsers/signup.controller"));
const signup_1 = require("../middlewares/validators/signup");
const validator_middleware_1 = require("../middlewares/validators/validator.middleware");
const userRouter = (0, express_1.Router)();
// Signup route
userRouter.post('/signup', signup_1.userSignupValidationSchema, validator_middleware_1.validateRequest, signup_controller_1.default);
// Login route
userRouter.post('/login', (req, res) => {
    // Call login controller here
});
// Edit user route
userRouter.put('/:id', (req, res) => {
    // Call edit controller here
});
// Delete user route
userRouter.delete('/:id', (req, res) => {
    // Call delete controller here
});
// Get all users
userRouter.get('/', (req, res) => {
    // Call get users controller here
});
// Filter users (e.g., by query params)
userRouter.get('/filter', (req, res) => {
    // Call filter users controller here
});
exports.default = userRouter;
