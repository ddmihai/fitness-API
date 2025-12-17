"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectMongo = async (uri, dbName) => {
    mongoose_1.default.set("strictQuery", true);
    await mongoose_1.default.connect(uri, {
        dbName,
        autoIndex: process.env.NODE_ENV !== "production",
    });
    console.log(`📦 MongoDB connected${dbName ? ` (${dbName})` : ""}`);
};
exports.connectMongo = connectMongo;
