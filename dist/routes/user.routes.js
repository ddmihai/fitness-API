"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signup_controller_1 = __importDefault(require("../controllers/users/createUsers/signup.controller"));
const signup_1 = require("../middlewares/validators/signup");
const validator_middleware_1 = require("../middlewares/validators/validator.middleware");
const loginUser_controller_1 = require("../controllers/users/loginUser/loginUser.controller");
const rateLimiter_1 = require("../middlewares/security/rateLimiter");
const jwtAuth_1 = require("../middlewares/auth/jwtAuth");
const getLoggedInUser_controller_1 = require("../controllers/users/getLoggedInUser/getLoggedInUser.controller");
const userRouter = (0, express_1.Router)();
/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: Register a new user account
 *     tags:
 *       - Users
 *     description: Creates a new user with the "Client" role if it doesn't already exist. The request is rate-limited and validated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe123
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               avatar:
 *                 type: string
 *                 example: https://www.gravatar.com/avatar/?d=mp&s=200
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *                 description: Must include uppercase, lowercase, and a number.
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 createdUser:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: 60f7b2c5f38b0c1f243f679a
 *       400:
 *         description: Validation error or duplicate user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation Error
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       429:
 *         description: Too many requests from this IP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 429
 *                 error:
 *                   type: string
 *                   example: Too many requests from this IP, please try again later.
 *       500:
 *         description: Internal server error or duplicate field
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *                 message:
 *                   type: string
 */
userRouter.post('/signup', rateLimiter_1.authenticationLimiter, signup_1.userSignupValidationSchema, validator_middleware_1.validateRequest, signup_controller_1.default);
/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Users
 *     description: Authenticates a user and returns a JWT token via HTTP-only cookie. Rate-limited.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful, token set in HTTP-only cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful!
 *       400:
 *         description: Missing email or password in request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email and password are required!
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials!
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found!
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 429
 *                 error:
 *                   type: string
 *                   example: Too many requests from this IP, please try again later.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
userRouter.post('/login', rateLimiter_1.authenticationLimiter, loginUser_controller_1.loginUser);
/**
 * @swagger
 * /api/v1/users/logged-user:
 *   get:
 *     summary: Get current logged-in user information
 *     tags:
 *       - Users
 *     description: Retrieves the details of the authenticated user by verifying JWT token from HTTP-only cookie. Uses Redis cache for performance.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved logged-in user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Unauthorized, token missing, expired, or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No token provided / Token expired / Invalid token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Something went wrong
 */
userRouter.get('/logged-user', jwtAuth_1.jwtAuth, getLoggedInUser_controller_1.getLoggedinUser);
// IMPLEMENTATIONS I HAVENT IMPLEMENTED FOR NOW
// Edit user route
userRouter.put('/:id', (req, res) => {
    // Call edit controller here
});
// Delete user route
userRouter.delete('/:id', (req, res) => {
    // Call delete controller here
});
// Filter users (e.g., by query params)
userRouter.get('/filter', (req, res) => {
    // Call filter users controller here
});
exports.default = userRouter;
