"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    roles: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
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
            validator: function (v) {
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
            validator: function (v) {
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
            validator: function (v) {
                // At least one lowercase, one uppercase, one digit, minimum 8 characters, allows special chars
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
            },
            message: () => `Password must be at least 8 characters long and contain uppercase, lowercase, and a number.`,
        }
    }
}, {
    timestamps: true,
});
// PRE save hook to hash password
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            const bcrypt = require("bcryptjs");
            const saltRounds = 10;
            this.password = yield bcrypt.hash(this.password, saltRounds);
        }
        next();
    });
});
// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const bcrypt = require("bcryptjs");
        return yield bcrypt.compare(candidatePassword, this.password);
    });
};
// Use the interface when creating the model
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
