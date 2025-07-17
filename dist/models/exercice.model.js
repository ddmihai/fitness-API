"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const exerciceSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    imageUrl: {
        type: [{
                url: {
                    type: String,
                    required: false,
                    validate: {
                        validator: (url) => /^https?:\/\/.+/.test(url),
                        message: 'Each image URL must be a valid URL.'
                    }
                },
                publicId: {
                    type: String,
                    required: true
                }
            }]
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
    targetMuscle: {
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
    videoUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function (url) {
                return !url || /^https?:\/\/.+/.test(url);
            },
            message: 'Video URL must be valid if provided'
        }
    },
    tags: {
        type: [String],
        lowercase: true,
        trim: true
    },
    focus: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: ['strength', 'hypertrophy', 'mobility', 'rehab', 'cardio']
    },
    isBodyweight: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        lowercase: true,
        trim: true
    },
    difficulty: {
        type: String,
        lowercase: true,
        trim: true,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    category: {
        type: String,
        lowercase: true,
        trim: true,
        enum: ['gym', 'home']
    },
    verified: {
        type: Boolean,
        default: false
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
    }
});
// Ensure unique combination of name and bodyPart
exerciceSchema.index({ name: 1, bodyPart: 1 }, { unique: true });
const Exercice = mongoose_1.default.model("Exercice", exerciceSchema);
exports.default = Exercice;
