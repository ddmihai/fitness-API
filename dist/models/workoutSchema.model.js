"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workout = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Mongoose schema definition
const workoutExerciseSchema = new mongoose_1.default.Schema({
    exercise: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Exercice", required: true },
    order: { type: Number, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true },
    rest: { type: Number, required: true },
    notes: { type: String },
});
const workoutSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    exercises: [workoutExerciseSchema],
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
exports.Workout = mongoose_1.default.model("Workout", workoutSchema);
