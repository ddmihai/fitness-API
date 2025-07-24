import { Router } from 'express';
import { createWorkout } from '../controllers/workouts/createWorkouts/createWorkout.controller';
import { jwtAuth } from '../middlewares/auth/jwtAuth';
import { validateRequest } from '../middlewares/validators/validator.middleware';
import workoutValidationSchema from '../middlewares/validators/createWorkouts.middleware';
const workoutRouter = Router();




// Create a new workout:
workoutRouter.post(
    '/create-workout',
    jwtAuth,
    workoutValidationSchema,
    validateRequest,
    createWorkout
);



// // Get all workouts created by user ID
// workoutRouter.get('/user/:userId');


export default workoutRouter;