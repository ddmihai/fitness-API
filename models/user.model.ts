import mongoose, { Document, Schema } from "mongoose";
import { IRole } from "./role.model";





// Define the interface
export interface IUser extends Document {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    password: string;
    createdAt: Date;
    // compare password
    comparePassword(candidatePassword: string): Promise<boolean>;
    updatedAt: Date;
    roles?: mongoose.Types.ObjectId[] | IRole[];
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },


        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }],


        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            validate: {
                validator: function (v: string) {
                    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            },
        },

        avatar: {
            type: String,
            required: false,
            default: "https://www.gravatar.com/avatar/?d=mp&s=200",
            validate: {
                validator: function (v: string) {
                    return /^https?:\/\/[^\s]+$/.test(v);
                },
                message: props => `${props.value} is not a valid URL!`
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
            validate: {
                validator: function (v: string) {
                    // At least one lowercase, one uppercase, one digit, minimum 8 characters, allows special chars
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
                },
                message: () =>
                    `Password must be at least 8 characters long and contain uppercase, lowercase, and a number.`,
            }

        }
    },
    {
        timestamps: true,
    }
);


// PRE save hook to hash password
userSchema.pre<IUser>("save", async function (next) {
    if (this.isModified("password")) {
        const bcrypt = require("bcryptjs");
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});


// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const bcrypt = require("bcryptjs");
    return await bcrypt.compare(candidatePassword, this.password);
};








// Use the interface when creating the model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
