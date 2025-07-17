"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = sendError;
function sendError(res, statusCode, message, details) {
    return res.status(statusCode).json(Object.assign({ status: 'error', statusCode,
        message }, (details && { details })));
}
