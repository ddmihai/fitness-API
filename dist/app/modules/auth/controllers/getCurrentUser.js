"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const getCurrentUser = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        }
        const user = req.user;
        const plainUser = user.toObject();
        const payload = {
            id: plainUser._id.toString(),
            name: plainUser.name,
            email: plainUser.email,
            role: plainUser.role,
            isActive: plainUser.isActive,
            createdAt: plainUser.createdAt,
            updatedAt: plainUser.updatedAt,
        };
        return res.status(200).json({ ok: true, data: payload });
    }
    catch (error) {
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
