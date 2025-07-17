import { Request, Response } from 'express';
import User, { IUser } from '../../../models/user.model';
import { sendError } from '../../../helpers/http_responses/error.service';
import jwt from 'jsonwebtoken';
import ENV from '../../../config/env.config';




export const loginUser = async (req: Request, res: Response) => {
    try {
        if (!req.body) return sendError(res, 400, 'Invalid request. No body object found!');
        const { email, password } = req.body;
        if (!email || !password) return sendError(res, 400, 'Email and password are required!');


        const userToFind = await User.findOne({ email }).select('+password');
        if (!userToFind) return sendError(res, 404, 'User not found!');

        // check the password
        const isPasswordValid = await userToFind?.comparePassword(password);
        if (!isPasswordValid) return sendError(res, 401, 'Invalid credentials!');




        // // Create JWT token asynchronously
        const token = jwt.sign(
            { userId: userToFind._id, role: userToFind.roles },
            ENV.JWT_SECRET,
            { expiresIn: '1h' }
        );


        // Send token in HTTP-only cookie (example)
        res.cookie('token', token, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'strict' as 'strict' | 'lax' | 'none' | undefined
        });

        res.status(200).json({ message: 'Login successful!' });
    }

    catch (error) {
        console.error('Error during login:', error);
        sendError(res, 500, 'Internal server error');
    }
}
