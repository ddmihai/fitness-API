import { Router } from "express";
import { homeRoutes } from "../modules/home/routes";
import { healthRoutes } from "../modules/health/routes";

export const router = Router();

router.use("/", homeRoutes);
router.use("/health", healthRoutes);

// Later:
// router.use("/auth", authRoutes);
// router.use("/users", usersRoutes);
// router.use("/exercises", exercisesRoutes);
// router.use("/sessions", sessionsRoutes);
