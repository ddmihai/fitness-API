"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_handlebars_1 = require("express-handlebars");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes");
const notFound_1 = require("./middlewares/notFound");
const errorHandler_1 = require("./middlewares/errorHandler");
const routes_2 = __importDefault(require("./modules/auth/routes"));
const routes_3 = __importDefault(require("./modules/exercises/routes"));
const swagger_1 = require("./docs/swagger");
exports.app = (0, express_1.default)();
// security + basics
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)({ origin: true, credentials: true }));
exports.app.use((0, compression_1.default)());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json({ limit: "1mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, morgan_1.default)("dev"));
exports.app.set("trust proxy", 1);
const viewsDir = path_1.default.join(__dirname, "views");
const layoutsDir = path_1.default.join(viewsDir, "layouts");
const partialsDir = path_1.default.join(viewsDir, "partials");
const publicDir = path_1.default.join(__dirname, "public");
// views (Handlebars)
exports.app.engine("hbs", (0, express_handlebars_1.engine)({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir,
    partialsDir,
}));
exports.app.set("view engine", "hbs");
exports.app.set("views", viewsDir);
// static
exports.app.use("/public", express_1.default.static(publicDir));
// docs
exports.app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customSiteTitle: "Fitness Tracker API Docs",
}));
exports.app.get("/docs.json", (_req, res) => res.json(swagger_1.swaggerSpec));
// routes
exports.app.use(routes_1.router);
exports.app.use('/v1/auth', routes_2.default);
exports.app.use('/v1/exercice', routes_3.default);
// errors
exports.app.use(notFound_1.notFound);
exports.app.use(errorHandler_1.errorHandler);
