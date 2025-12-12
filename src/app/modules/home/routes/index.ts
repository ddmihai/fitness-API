import { Router } from "express";
import { renderHome } from "../controllers/home.controller";

export const homeRoutes = Router();
homeRoutes.get("/", renderHome);
