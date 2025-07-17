"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const rateLimiter_1 = require("./middlewares/security/rateLimiter");
const exercice_routes_1 = __importDefault(require("./routes/exercice.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// Basic page route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Fitness Personal Training API' });
});
app.use('/api/v1/users', rateLimiter_1.authenticationLimiter, user_routes_1.default);
app.use('/api/v1/exercices', rateLimiter_1.exerciceLimiter, exercice_routes_1.default);
// 404 Error handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});
exports.default = app;
