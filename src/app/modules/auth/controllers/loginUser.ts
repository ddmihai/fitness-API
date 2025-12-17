import { Request, Response, NextFunction } from "express";
import { UserService } from "../../users/services/user.service";
import jwt from 'jsonwebtoken';
import { env } from "../../../config/env";






export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const emailInput = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const passwordInput = typeof req.body.password === "string" ? req.body.password.trim() : "";

        if (!emailInput || !passwordInput) {
            return res.status(400).json({ ok: false, message: "All fields are required" });
        }

        const user = await UserService.getUserByEmailWithPassword(emailInput);
        console.log(user);

        if (!user) {
            return res.status(401).json({ ok: false, message: "Invalid credentials" });
        };

        const isMatch = await user.comparePassword(passwordInput);

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
