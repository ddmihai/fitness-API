import mongoose, { Document } from "mongoose";


export interface IRole extends Document {
    name: string;
    displayName: string;
    description?: string;
    permissions: string[];
    isSystemRole: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // e.g., "trainer", "client", "admin"
        lowercase: true,
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    permissions: {
        type: [String], // e.g., ["manage_clients", "view_dashboard", "delete_content"]
        default: []
    },
    isSystemRole: {
        type: Boolean,
        default: false // true if core role like 'admin' (cannot be deleted from dashboard)
    },
}, { timestamps: true });

export const Role = mongoose.model("Role", roleSchema, "roles");
