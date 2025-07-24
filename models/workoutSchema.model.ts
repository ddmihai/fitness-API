import mongoose, { Types, Document } from "mongoose";






// Interface for each exercise inside a workout
export interface IWorkoutExercise {
    exercise: Types.ObjectId;    // Reference to Exercice model
    order: number;
    sets: number;
    reps: string;
    rest: number;               // seconds of rest between sets
    notes?: string;
}

// Main Workout interface extending mongoose Document for typing
export interface IWorkout extends Document {
    name: string;
    exercises: IWorkoutExercise[];
    createdBy: Types.ObjectId;  // Reference to User who created this workout
    createdAt: Date;
}

// Mongoose schema definition
const workoutExerciseSchema = new mongoose.Schema<IWorkoutExercise>({
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercice", required: true },
    order: { type: Number, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true },
    rest: { type: Number, required: true },
    notes: { type: String },
});




const workoutSchema = new mongoose.Schema<IWorkout>({
    name: { type: String, required: true },
    exercises: [workoutExerciseSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });






export const Workout = mongoose.model<IWorkout>("Workout", workoutSchema);

