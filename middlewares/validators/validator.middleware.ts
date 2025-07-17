import { validationResult, ValidationError } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../../helpers/http_responses/error.service';

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formatted = errors.array().map((err: any) => ({
            field: err.param ?? 'form',
            message: err.msg,
        }));


        return sendError(res, 400, 'Validation Error', formatted);
    }

    next();
};
