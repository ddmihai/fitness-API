import { Request, Response, NextFunction } from "express";
import { UserService } from "../../users/services/user.service";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        const user = await UserService.createUser({ name, email, password });

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
