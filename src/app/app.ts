import path from "path";
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


// views (Handlebars)
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(process.cwd(), "src/app/views/layouts"),
        partialsDir: path.join(process.cwd(), "src/app/views/partials"),
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(process.cwd(), "src/app/views"));

// static
app.use("/public", express.static(path.join(process.cwd(), "src/app/public")));

// docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Fitness Tracker API Docs",
}));
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));

// routes
app.use(router);
app.use('/v1/auth', authrouter);
app.use('/v1/exercice', exerciceRouter);


// errors
app.use(notFound);
app.use(errorHandler);
