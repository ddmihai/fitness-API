import { Router } from "express";
import { globalLimiter } from "../../../middlewares/rate-limiter";
import { authGuard } from "../../../middlewares/authGuard";
import { adminGuard } from "../../../middlewares/requireAdmin";
import { getUserDetails, listUsers, updateUserDetails } from "../controllers";

const usersRouter = Router();

usersRouter.use(globalLimiter, authGuard, adminGuard);

usersRouter.get("/", listUsers);
usersRouter.get("/:id", getUserDetails);
usersRouter.patch("/:id", updateUserDetails);

export default usersRouter;
