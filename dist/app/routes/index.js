"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const routes_1 = require("../modules/home/routes");
const routes_2 = require("../modules/health/routes");
exports.router = (0, express_1.Router)();
exports.router.use("/", routes_1.homeRoutes);
exports.router.use("/health", routes_2.healthRoutes);
// Later:
// router.use("/auth", authRoutes);
// router.use("/users", usersRoutes);
// router.use("/exercises", exercisesRoutes);
// router.use("/sessions", sessionsRoutes);
