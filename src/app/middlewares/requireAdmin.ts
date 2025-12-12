import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';



export const adminGuard = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new AppError("Unauthorized", 401));
    }

    if (req.user.role !== "admin") {
        return next(new AppError("Forbidden", 403));
    }

    next();
};
