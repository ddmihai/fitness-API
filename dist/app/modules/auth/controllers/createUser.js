"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const user_service_1 = require("../../users/services/user.service");
const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await user_service_1.UserService.createUser({ name, email, password });
        // sanitize
        const safeUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        return res.status(201).json({ ok: true, data: safeUser });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
