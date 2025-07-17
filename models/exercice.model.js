"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const exerciceSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true, // Ensure name is stored in lowercase
    },
    bodyPart: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    equipment: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    target: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    secondaryMuscles: {
        type: [String],
        lowercase: true,
        trim: true
    },
    instructions: {
        type: [String],
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        lowercase: true,
        trim: true
    },
    difficulty: {
        type: String,
        lowercase: true,
        trim: true
    },
    category: {
        type: String,
        lowercase: true,
        trim: true
    },
    addedBy: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: true,
        validate: {
            validator: function (value) {
                return (mongoose_1.default.isValidObjectId(value) || value === 'system');
            },
            message: 'addedBy must be a valid ObjectId or "system"',
        },
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    isManual: {
        type: Boolean,
        default: false
    }
});
// Ensure unique combination of name and bodyPart
exerciceSchema.index({ name: 1, bodyPart: 1 }, { unique: true });
const Exercice = mongoose_1.default.model("Exercice", exerciceSchema);
exports.default = Exercice;
