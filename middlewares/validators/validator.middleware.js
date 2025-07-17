"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const error_service_1 = require("../../helpers/http_responses/error.service");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formatted = errors.array().map((err) => {
            var _a;
            return ({
                field: (_a = err.param) !== null && _a !== void 0 ? _a : 'form',
                message: err.msg,
            });
        });
        return (0, error_service_1.sendError)(res, 400, 'Validation Error', formatted);
    }
    next();
};
exports.validateRequest = validateRequest;
