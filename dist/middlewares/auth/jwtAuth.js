"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = __importDefault(require("../../config/env.config"));
const error_service_1 = require("../../helpers/http_responses/error.service");
const jwtAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return (0, error_service_1.sendError)(res, 401, 'No token provided', 'Authentication token is required.');
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_config_1.default.JWT_SECRET);
        if (!decoded || typeof decoded !== 'object') {
            return (0, error_service_1.sendError)(res, 401, 'Invalid token', 'Could not decode token.');
        }
        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role || []
        };
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return (0, error_service_1.sendError)(res, 401, 'Token expired', 'Please login again.');
        }
        return (0, error_service_1.sendError)(res, 401, 'Invalid token', err.message);
    }
};
exports.jwtAuth = jwtAuth;
