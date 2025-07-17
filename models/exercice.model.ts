import mongoose, { Types } from "mongoose";
import { lowercase } from "zod";




export interface IExercise extends mongoose.Document {
    _id: Types.ObjectId; // internal MongoDB ID
    id: string; // API exercise ID or your own generated ID for manual
    name: string;
    bodyPart: string;
    equipment: string;
    target: string;
    secondaryMuscles?: string[];
    instructions?: string[];
    description?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    category?: string;

    // Tracking who added it:
    addedBy: Types.ObjectId | 'system';
    addedAt: Date;   // timestamp for when it was added (optional but useful)

    // Optional flag to distinguish manual vs API source
    isManual?: boolean; // true if added manually, false or undefined if from API
}



const exerciceSchema = new mongoose.Schema({
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
    },

    isManual: {
        type: Boolean,
        default: false
    }
});


// Ensure unique combination of name and bodyPart
exerciceSchema.index({ name: 1, bodyPart: 1 }, { unique: true });


const Exercice = mongoose.model("Exercice", exerciceSchema);
export default Exercice;