"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const user_service_1 = require("../../users/services/user.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../config/env");
const loginUser = async (req, res, next) => {
    try {
        const emailInput = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const passwordInput = typeof req.body.password === "string" ? req.body.password.trim() : "";
        if (!emailInput || !passwordInput) {
            return res.status(400).json({ ok: false, message: "All fields are required" });
        }
        const user = await user_service_1.UserService.getUserByEmailWithPassword(emailInput);
        console.log(user);
        if (!user) {
            return res.status(401).json({ ok: false, message: "Invalid credentials" });
        }
        ;
        const isMatch = await user.comparePassword(passwordInput);
        if (!isMatch) {
            return res.status(401).json({ ok: false, message: "Invalid credentials" });
        }
        ;
        const jsonPayload = {
            _id: user._id,
            email: user.email,
            role: user.role
        };
        // sign token
        const token = jsonwebtoken_1.default.sign(jsonPayload, env_1.env.JWT_SECRET, { expiresIn: '1d' });
        // set cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
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
exports.loginUser = loginUser;
