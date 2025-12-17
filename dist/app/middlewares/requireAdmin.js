"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGuard = void 0;
const AppError_1 = require("../errors/AppError");
const adminGuard = (req, _res, next) => {
    if (!req.user) {
        return next(new AppError_1.AppError("Unauthorized", 401));
    }
    if (req.user.role !== "admin") {
        return next(new AppError_1.AppError("Forbidden", 403));
    }
    next();
};
exports.adminGuard = adminGuard;
