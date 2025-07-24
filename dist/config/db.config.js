"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = __importDefault(require("./env.config"));
// create function to establish database connection
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbURI = process.env.NODE_ENV === 'production' ? env_config_1.default.MONGO_URI_PRODUCTION : env_config_1.default.MONGO_URI;
        yield mongoose_1.default.connect(dbURI);
        const message = process.env.NODE_ENV === 'production' ? 'Production database connected successfully' : 'Development database connected successfully';
        console.log(message);
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
});
exports.default = connectDB;
