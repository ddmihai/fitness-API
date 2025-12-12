import { Request, Response, NextFunction } from "express";
import { UserService } from "../../users/services/user.service";
import jwt from 'jsonwebtoken';
import { env } from "../../../config/env";




export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // make sure we have a body request and fields
        if (!email || !password) {
            return res.status(400).json({ ok: false, message: "All fields are required" });
        }


        // find user by email
        // normalize email
        const normalizedEmail = req.body.email.toLowerCase();
        const user = await UserService.getUserByEmailWithPassword(normalizedEmail);

        if (!user) {
            return res.status(404).json({ ok: false, message: "User not found" });
        };

        // compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ ok: false, message: "Invalid credentials" });
        };

        const jsonPayload = {
            _id: user._id,
            email: user.email,
            role: user.role
        };

        // sign token
        const token = jwt.sign(jsonPayload, env.JWT_SECRET!, { expiresIn: '1d' });

        // set cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        });

        // set the req.user
        req.user = user;

        return res.status(201).json({ ok: true, message: "Login successful" });
    }
    catch (error) {
        next(error);
    }
};
