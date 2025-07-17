import mongoose, { Types } from "mongoose";
import { lowercase } from "zod";




export interface IExercise extends mongoose.Document {
    _id: Types.ObjectId;                                                        // internal MongoDB ID
    name: string;
    imageUrl: string[],
    bodyPart: string;                                                           // Eg. Chest, legs, arms, abs, EYES :)))) hahah
    equipment: string;                                                          // Gym machine if required
    targetMuscle: string;                                                       // Primary muscle target
    secondaryMuscles?: string[];                                                // Secondary muscle target list [triceps, delts, front delts, etc]
    instructions?: string[];
    videoUrl?: string;
    tags: string[];                                                             // e.g. ['compound', 'dumbbell', 'home']
    focus: 'strength' | 'hypertrophy' | 'mobility' | 'rehab' | 'cardio';
    isBodyweight: boolean;
    description?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    category?: 'GYM' | 'HOME';                                                  // Eg. Gym, Home, or else

    // Tracking who added it and METADATA:
    addedBy: Types.ObjectId;
    verified?: boolean;                                                         // e.g. only show verified exercises
    addedAt: Date;                                                              // timestamp for when it was added (optional but useful)
}



const exerciceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    imageUrl: {
        type: [String],
        validate: {
            validator: function (urls: string[]) {
                return urls.every(url => /^https?:\/\/.+/.test(url));
            },
            message: 'Each image must be a valid URL.'
        },
        required: true
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
            validator: function (url: string) {
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
        type: mongoose.Schema.Types.Mixed,
        required: true,
        validate: {
            validator: function (value: any) {
                return (
                    mongoose.isValidObjectId(value) || value === 'system'
                );
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


const Exercice = mongoose.model("Exercice", exerciceSchema);
export default Exercice;