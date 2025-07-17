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
exports.loginUser = void 0;
const user_model_1 = __importDefault(require("../../../models/user.model"));
const error_service_1 = require("../../../helpers/http_responses/error.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = __importDefault(require("../../../config/env.config"));
const role_model_1 = require("../../../models/role.model");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body)
            return (0, error_service_1.sendError)(res, 400, 'Invalid request. No body object found!');
        const { email, password } = req.body;
        if (!email || !password)
            return (0, error_service_1.sendError)(res, 400, 'Email and password are required!');
        const userToFind = yield user_model_1.default.findOne({ email }).select('+password');
        if (!userToFind)
            return (0, error_service_1.sendError)(res, 404, 'User not found!');
        // check the password
        const isPasswordValid = yield (userToFind === null || userToFind === void 0 ? void 0 : userToFind.comparePassword(password));
        if (!isPasswordValid)
            return (0, error_service_1.sendError)(res, 401, 'Invalid credentials!');
        // add roles to the JWT. fetch the role assigned
        const role = yield role_model_1.Role.findOne({ _id: userToFind.roles });
        // // Create JWT token asynchronously
        const token = jsonwebtoken_1.default.sign({ userId: userToFind._id, role: role === null || role === void 0 ? void 0 : role._id }, env_config_1.default.JWT_SECRET, { expiresIn: '1h' });
        // Send token in HTTP-only cookie (example)
        res.cookie('token', token, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'strict'
        });
        res.status(200).json({ message: 'Login successful!' });
    }
    catch (error) {
        console.error('Error during login:', error);
        (0, error_service_1.sendError)(res, 500, 'Internal server error');
    }
});
exports.loginUser = loginUser;
