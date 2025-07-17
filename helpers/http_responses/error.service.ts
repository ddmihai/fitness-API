import { Response } from 'express';

export function sendError(res: Response, statusCode: number, message: string, details?: any) {
    return res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(details && { details }),
    });
}
