import { Request, Response, NextFunction } from 'express';
import { sendError } from '../../../helpers/http_responses/error.service';
import { selectUserByEmail } from '../../../dataAccessObject/users/users';
import User, { IUser } from '../../../models/user.model';



const signupController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, firstName, lastName, email, password } = req.body;

        // normalize and sanitize input
        const normalizedUsername = username.toLowerCase().trim();
        const normalizedEmail = email.toLowerCase().trim();
        const sanitizedFirstName = firstName.toLowerCase().trim();
        const sanitizedLastName = lastName.toLowerCase().trim();



        // Check if email already exists
        const existingUser = await selectUserByEmail(normalizedEmail);
        if (existingUser) {
            return sendError(res, 400, 'Email already exists', 'A user with this email already exists.');
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username: normalizedUsername });
        if (existingUsername) {
            return sendError(res, 400, 'Username already exists', 'A user with this username already exists.');
        }

        // Create and save new user
        const createdUser = await User.create({
            username: normalizedUsername,
            firstName: sanitizedFirstName,
            lastName: sanitizedLastName,
            email: normalizedEmail,
            avatar: 'https://www.gravatar.com/avatar/?d=mp&s=200',
            password
        });

        if (!createdUser || !createdUser._id) {
            return sendError(res, 500, 'User creation failed', 'Failed to create the user.');
        }


        // delete createdUser.password; // Remove password from response for security
        createdUser.password = ''; // Remove password for security


        return res.status(201).json({
            message: 'User created successfully',
            createdUser
        });

    }
    catch (error: any) {
        console.error('Signup error:', error);
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return sendError(res, 400, 'Duplicate field error', `The ${duplicateField} '${error.keyValue[duplicateField]}' is already in use.`);
        }

        return sendError(res, 500, 'Internal Server Error', error.message);
    }
};

export default signupController;
