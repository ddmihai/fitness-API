import { Request, Response } from 'express';
import { sendError } from '../../../helpers/http_responses/error.service';
import { IWorkoutExercise, Workout } from '../../../models/workoutSchema.model';
import Exercice from '../../../models/exercice.model';




interface AuthRequest extends Request {
    user?: {
        userId: string;
        role?: string[];
    };
}





export const createWorkout = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user)
            return sendError(res, 401, 'Unauthorized', 'User not authenticated');

        const { name, exercises } = req.body;
        const userId = req.user.userId;



        // Validator function inside the controller:
        const hasDuplicates = (exs: IWorkoutExercise[]) => {
            const exerciseIds = exs.map(e => e.exercise.toString());
            return new Set(exerciseIds).size !== exerciseIds.length;
        };

        if (hasDuplicates(exercises)) {
            return sendError(res, 400, 'Validation Error', 'Duplicate exercises detected in workout');
        }



        const exerciseIds = exercises.map((e: any) => e.exercise.toString());

        // Query DB for all exercises with those IDs
        const foundExercises = await Exercice.find({ _id: { $in: exerciseIds } }).select('_id');

        // Check if all IDs exist
        if (foundExercises.length !== exerciseIds.length) {
            return sendError(res, 400, 'Validation Error', 'One or more exercises do not exist');
        }





        // Create new workout instance
        const newWorkout = new Workout({
            name,
            createdBy: userId,
            exercises: exercises.map((exercise: IWorkoutExercise, index: number) => ({
                ...exercise,
                order: index + 1
            })),
        });


        // Save workout to DB
        await newWorkout.save();


        return res.status(201).json({
            message: 'Workout created successfully'
        });
    }

    // handle errors
    catch (error) {
        if (error instanceof Error) {
            console.error('Error creating workout:', error.message);
            return sendError(res, 500, 'Error creating workout', error.message);
        }
        console.error('Unknown error:', error);
        return sendError(res, 500, 'Unknown error', 'An unknown error occurred');
    }
};
