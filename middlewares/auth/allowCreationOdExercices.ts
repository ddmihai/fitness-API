import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ENV from '../../config/env.config';
import { sendError } from '../../helpers/http_responses/error.service';
import { Role } from '../../models/role.model';


interface AuthRequest extends Request {
    user?: { userId: string; role: string[] };
}


export const requirePermission = (requiredPermission: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.token;

            if (!token)
                return sendError(res, 401, 'No token provided', 'Authentication token is required.');

            const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

            if (!decoded || typeof decoded !== 'object' || !decoded.role)
                return sendError(res, 401, 'Invalid token', 'Could not decode token payload.');

            const roleIds = Array.isArray(decoded.role) ? decoded.role : [decoded.role];

            const roles = await Role.find({ _id: { $in: roleIds } });

            if (!roles.length)
                return sendError(res, 403, 'Unauthorized', 'You are not authorized to access this resource.');

            const allPermissions = roles.flatMap(role => role.permissions);

            if (!allPermissions.includes(requiredPermission))
                return sendError(res, 403, 'Forbidden', 'You do not have the required permission.');



            req.user = {
                userId: decoded.userId,
                role: allPermissions // or keep roles if needed
            };

            next();
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                return sendError(res, 401, 'Token expired', 'Please log in again.');
            }

            return sendError(res, 401, 'Invalid token', err.message || 'Token verification failed.');
        }
    };
};
