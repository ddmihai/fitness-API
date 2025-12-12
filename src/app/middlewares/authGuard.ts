import { Request, Response, NextFunction } from 'express';
import { User } from '../modules/users/models';
import jwt from "jsonwebtoken";
import { env } from '../config/env';


type JwtPayload = {
    _id: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
};


export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get the token
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    }

    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};