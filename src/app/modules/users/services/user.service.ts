import { User } from "../models";
import { AppError } from "../../../errors/AppError";

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const normalizeName = (name: string) => name.trim();

type CreateUserDTO = {
    name: string;
    email: string;
    password: string;
    role?: "user" | "admin" | "collaborator"; // optional 
};




export const UserService = {
    async getUserByEmailWithPassword(email: string) {
        if (!email) return null;
        return await User.findOne({ email: normalizeEmail(email) }).select("+password");
    },

    async getUserByEmail(email: string) {
        if (!email) return null;
        return await User.findOne({ email: normalizeEmail(email) });
    },


    async getAllUsers() {
        return await User.find();
    },

    async getUserById(id: string) {
        return await User.findById(id);
    },

    async updateUser(id: string, data: any) {
        return await User.findByIdAndUpdate(id, data, { new: true });
    },

    async deleteUser(id: string) {
        return await User.findByIdAndDelete(id);
    },



    async createUser(data: CreateUserDTO) {
        const payload = {
            name: normalizeName(data.name),
            email: normalizeEmail(data.email),
            password: data.password, // hashed by pre-save
            role: data.role,         // or omit if you don’t want callers setting it
        };

        try {
            const user = new User(payload);
            return await user.save();
        } catch (err: any) {
            // Duplicate key (email)
            if (err?.code === 11000) {
                throw new AppError("User already exists", 400);
            }
            throw err;
        }
    },
};
