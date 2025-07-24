"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const exercice_routes_1 = __importDefault(require("./routes/exercice.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = __importDefault(require("./config/swagger.config"));
const workouts_routes_1 = __importDefault(require("./routes/workouts.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.set('trust proxy', 1); // or true
app.use((0, cookie_parser_1.default)());
// documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.default));
// Basic page route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Fitness Personal Training API' });
});
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/exercices', exercice_routes_1.default);
app.use('/api/v1/workouts', workouts_routes_1.default);
// 404 Error handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});
exports.default = app;
