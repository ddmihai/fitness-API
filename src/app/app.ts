import path from "path";
import { existsSync } from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { engine } from "express-handlebars";
import swaggerUi from "swagger-ui-express";

import { router } from "./routes";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import authrouter from "./modules/auth/routes";
import exerciceRouter from "./modules/exercises/routes";
import sessionRouter from "./modules/sessions/routes";
import usersRouter from "./modules/users/routes";
import { swaggerSpec } from "./docs/swagger";

export const app = express();

// security + basics
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.set("trust proxy", 1);


const viewsDir = path.join(__dirname, "views");
const layoutsDir = path.join(viewsDir, "layouts");
const partialsDir = path.join(viewsDir, "partials");
const publicDir = path.join(__dirname, "public");
const clientDir = path.join(publicDir, "app");
const clientIndexPath = path.join(clientDir, "index.html");

// views (Handlebars)
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir,
        partialsDir,
    })
);
app.set("view engine", "hbs");
app.set("views", viewsDir);

// static
app.use("/public", express.static(publicDir));
if (existsSync(clientDir)) {
    app.use(express.static(clientDir));
}

// docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Fitness Tracker API Docs",
}));
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));

// routes
app.use(router);
app.use('/v1/auth', authrouter);
app.use('/v1/exercice', exerciceRouter);
app.use('/v1/sessions', sessionRouter);

if (existsSync(clientIndexPath)) {
    const spaMatcher = /^\/(?!v1(?:\/|$)|docs(?:\/|$)).*/;
    app.get(spaMatcher, (req, res, next) => {
        if (req.method !== "GET") return next();
        return res.sendFile(clientIndexPath);
    });
}
app.use('/v1/users', usersRouter);


// errors
app.use(notFound);
app.use(errorHandler);
