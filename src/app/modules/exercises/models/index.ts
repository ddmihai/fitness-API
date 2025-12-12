import mongoose, { InferSchemaType } from "mongoose";



const exerciceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
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


export type ExerciseTemplateDocument = InferSchemaType<typeof exerciceSchema>;

export const Exercises = mongoose.model<ExerciseTemplateDocument>("Exercises", exerciceSchema);


export default Exercises;