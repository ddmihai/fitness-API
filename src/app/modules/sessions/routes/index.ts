import { Router } from "express";
import { globalLimiter } from "../../../middlewares/rate-limiter";
import { authGuard } from "../../../middlewares/authGuard";
import {
    createTemplate,
    deleteTemplate,
    getTemplateDetails,
    listTemplates,
    updateTemplate,
} from "../controllers/templates";
import {
    completeSession,
    deleteSession,
    getActivitySummary,
    getExerciseHistory,
    getSessionDetails,
    listSessions,
    scheduleSession,
    updateSession,
} from "../controllers/sessions";

const sessionRouter = Router();

sessionRouter.use(globalLimiter, authGuard);

sessionRouter.post("/templates", createTemplate);
sessionRouter.get("/templates", listTemplates);
sessionRouter.get("/templates/:id", getTemplateDetails);
sessionRouter.put("/templates/:id", updateTemplate);
sessionRouter.delete("/templates/:id", deleteTemplate);

sessionRouter.post("/", scheduleSession);
sessionRouter.get("/", listSessions);
sessionRouter.get("/history/activity", getActivitySummary);
sessionRouter.get("/history/exercise/:exerciseId", getExerciseHistory);
sessionRouter.get("/:id", getSessionDetails);
sessionRouter.patch("/:id", updateSession);
sessionRouter.post("/:id/complete", completeSession);
sessionRouter.delete("/:id", deleteSession);

export default sessionRouter;
