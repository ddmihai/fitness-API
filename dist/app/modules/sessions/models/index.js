"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutSession = exports.WorkoutTemplate = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const templateExerciseSchema = new mongoose_1.Schema({
    exercise: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { _id: true });
const workoutTemplateSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            (value) => Array.isArray(value) && value.length > 0,
            "A template must include at least one exercise.",
        ],
    },
}, { timestamps: true });
workoutTemplateSchema.index({ user: 1, isActive: 1, updatedAt: -1 });
exports.WorkoutTemplate = mongoose_1.default.model("WorkoutTemplate", workoutTemplateSchema);
const sessionSetSchema = new mongoose_1.Schema({
    setNumber: { type: Number, min: 1, max: 100 },
    reps: { type: Number, min: 0, max: 200 },
    weight: { type: Number, min: 0, max: 2000 },
    rpe: { type: Number, min: 0, max: 10 },
    notes: { type: String, trim: true, maxlength: 300 },
}, { _id: true });
const sessionExerciseSchema = new mongoose_1.Schema({
    templateExerciseId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    exercise: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { _id: true });
const workoutSessionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    template: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
workoutSessionSchema.index({ user: 1, scheduledFor: 1 });
workoutSessionSchema.index({ user: 1, status: 1 });
exports.WorkoutSession = mongoose_1.default.model("WorkoutSession", workoutSessionSchema);
