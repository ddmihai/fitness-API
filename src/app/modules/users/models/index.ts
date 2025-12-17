import mongoose, { HydratedDocument, InferSchemaType, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
    ADMIN = "admin",
    COLLABORATOR = "collaborator",
    USER = "user",
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        lowercase: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        minlength: 5,
        lowercase: true,
        trim: true,
        maxlength: 255,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        index: true
    },

    // Store the hashed password
    password: {
        type: String,
        required: true,
        select: false, // Don't return password in queries by default
    },

    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER,
        required: true,
    },

    isActive: {
        type: Boolean,
        default: true
    },
},
    { timestamps: true }
);

// Hash pass
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    if (this.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
    }

    this.password = await bcrypt.hash(this.password, 12);
});



// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    return await bcrypt.compare(candidate, this.password);
};

type ComparePassword = {
    comparePassword(candidate: string): Promise<boolean>;
};

export type UserDocument = HydratedDocument<InferSchemaType<typeof userSchema> & ComparePassword>;

export const User = model<UserDocument>("User", userSchema);
