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
exports.requirePermission = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = __importDefault(require("../../config/env.config"));
const error_service_1 = require("../../helpers/http_responses/error.service");
const role_model_1 = require("../../models/role.model");
const requirePermission = (requiredPermission) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
            if (!token)
                return (0, error_service_1.sendError)(res, 401, 'No token provided', 'Authentication token is required.');
            const decoded = jsonwebtoken_1.default.verify(token, env_config_1.default.JWT_SECRET);
            if (!decoded || typeof decoded !== 'object' || !decoded.role)
                return (0, error_service_1.sendError)(res, 401, 'Invalid token', 'Could not decode token payload.');
            const roleIds = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
            const roles = yield role_model_1.Role.find({ _id: { $in: roleIds } });
            if (!roles.length)
                return (0, error_service_1.sendError)(res, 403, 'Unauthorized', 'You are not authorized to access this resource.');
            const allPermissions = roles.flatMap(role => role.permissions);
            if (!allPermissions.includes(requiredPermission))
                return (0, error_service_1.sendError)(res, 403, 'Forbidden', 'You do not have the required permission.');
            req.user = {
                userId: decoded.userId,
                role: allPermissions // or keep roles if needed
            };
            next();
        }
        catch (err) {
            if (err.name === 'TokenExpiredError') {
                return (0, error_service_1.sendError)(res, 401, 'Token expired', 'Please log in again.');
            }
            return (0, error_service_1.sendError)(res, 401, 'Invalid token', err.message || 'Token verification failed.');
        }
    });
};
exports.requirePermission = requirePermission;
