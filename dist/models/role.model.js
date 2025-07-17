"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const roleSchema = new mongoose_1.default.Schema({
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
    }
}, { timestamps: true });
exports.Role = mongoose_1.default.model("Role", roleSchema, "roles");
