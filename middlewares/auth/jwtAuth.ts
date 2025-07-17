import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ENV from '../../config/env.config';
import { sendError } from '../../helpers/http_responses/error.service';


interface AuthRequest extends Request {
    user?: { userId: string; role: string[] };
}

export const jwtAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return sendError(res, 401, 'No token provided', 'Authentication token is required.');
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

        if (!decoded || typeof decoded !== 'object') {
            return sendError(res, 401, 'Invalid token', 'Could not decode token.');
        }

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role || []
        };

        next();
    }

    catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            return sendError(res, 401, 'Token expired', 'Please login again.');
        }

        return sendError(res, 401, 'Invalid token', err.message);
    }
};
