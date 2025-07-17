"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rateLimiter_1 = require("../middlewares/security/rateLimiter");
const getExerciceByTargetMuscle_1 = require("../controllers/exercices/getExerciceByTargetMuscle/getExerciceByTargetMuscle");
const exerciceRouter = (0, express_1.Router)();
exerciceRouter.get('/get-exercice-by-target-muscle/:targetMuscle', rateLimiter_1.exerciceLimiter, getExerciceByTargetMuscle_1.getExercisesByTargetMuscle);
exports.default = exerciceRouter;
