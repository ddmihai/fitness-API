import mongoose, { InferSchemaType, Schema } from "mongoose";

const templateExerciseSchema = new Schema(
    {
        exercise: {
            type: Schema.Types.ObjectId,
            ref: "Exercises",
            required: true,
        },
        exerciseName: {
            type: String,
            required: true,
            trim: true,
        },
        plannedSets: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },
        plannedRepsMin: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },
        plannedRepsMax: {
            type: Number,
            min: 1,
            max: 100,
        },
        restSeconds: {
            type: Number,
            min: 0,
            max: 600,
        },
        order: {
            type: Number,
            required: true,
            min: 0,
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    { _id: true }
);

const workoutTemplateSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        exercises: {
            type: [templateExerciseSchema],
            validate: [
                (value: unknown[]) => Array.isArray(value) && value.length > 0,
                "A template must include at least one exercise.",
            ],
        },
    },
    { timestamps: true }
);

workoutTemplateSchema.index({ user: 1, isActive: 1, updatedAt: -1 });

export type WorkoutTemplateDocument = InferSchemaType<typeof workoutTemplateSchema>;

export const WorkoutTemplate = mongoose.model<WorkoutTemplateDocument>(
    "WorkoutTemplate",
    workoutTemplateSchema
);

const sessionSetSchema = new Schema(
    {
        setNumber: { type: Number, min: 1, max: 100 },
        reps: { type: Number, min: 0, max: 200 },
        weight: { type: Number, min: 0, max: 2000 },
        rpe: { type: Number, min: 0, max: 10 },
        notes: { type: String, trim: true, maxlength: 300 },
    },
    { _id: true }
);

const sessionExerciseSchema = new Schema(
    {
        templateExerciseId: {
            type: Schema.Types.ObjectId,
        },
        exercise: {
            type: Schema.Types.ObjectId,
            ref: "Exercises",
            required: true,
        },
        exerciseName: {
            type: String,
            required: true,
        },
        plannedSets: {
            type: Number,
            min: 0,
            max: 20,
        },
        plannedRepsMin: {
            type: Number,
            min: 0,
            max: 200,
        },
        plannedRepsMax: {
            type: Number,
            min: 0,
            max: 200,
        },
        restSeconds: {
            type: Number,
            min: 0,
            max: 600,
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        order: {
            type: Number,
            min: 0,
        },
        actualSets: {
            type: [sessionSetSchema],
            default: [],
        },
        status: {
            type: String,
            enum: ["pending", "completed", "skipped"],
            default: "pending",
        },
        feedback: {
            type: String,
            trim: true,
            maxlength: 300,
        },
    },
    { _id: true }
);

const workoutSessionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        template: {
            type: Schema.Types.ObjectId,
            ref: "WorkoutTemplate",
        },
        templateSnapshot: {
            name: { type: String },
            color: { type: String },
        },
        scheduledFor: {
            type: Date,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["planned", "completed", "cancelled", "missed"],
            default: "planned",
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        completedAt: {
            type: Date,
        },
        cancelledReason: {
            type: String,
            trim: true,
        },
        exercises: {
            type: [sessionExerciseSchema],
            default: [],
        },
    },
    { timestamps: true }
);

workoutSessionSchema.index({ user: 1, scheduledFor: 1 });
workoutSessionSchema.index({ user: 1, status: 1 });

export type WorkoutSessionDocument = InferSchemaType<typeof workoutSessionSchema>;

export const WorkoutSession = mongoose.model<WorkoutSessionDocument>(
    "WorkoutSession",
    workoutSessionSchema
);
