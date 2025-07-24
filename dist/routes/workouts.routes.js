"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createWorkout_controller_1 = require("../controllers/workouts/createWorkouts/createWorkout.controller");
const jwtAuth_1 = require("../middlewares/auth/jwtAuth");
const validator_middleware_1 = require("../middlewares/validators/validator.middleware");
const createWorkouts_middleware_1 = __importDefault(require("../middlewares/validators/createWorkouts.middleware"));
const workoutRouter = (0, express_1.Router)();
// Create a new workout:
workoutRouter.post('/create-workout', jwtAuth_1.jwtAuth, createWorkouts_middleware_1.default, validator_middleware_1.validateRequest, createWorkout_controller_1.createWorkout);
// // Get all workouts created by user ID
// workoutRouter.get('/user/:userId');
exports.default = workoutRouter;
