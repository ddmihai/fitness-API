"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exercises = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const exerciceSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    imagePath: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    muscleGroups: {
        type: [String],
        required: true
    },
    category: {
        type: [String],
        required: true
    },
    equipment: {
        type: [String],
        required: true,
        lowercase: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
exports.Exercises = mongoose_1.default.model("Exercises", exerciceSchema);
exports.default = exports.Exercises;
