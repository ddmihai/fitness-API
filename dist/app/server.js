"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const env_1 = require("./config/env");
const mongo_1 = require("./db/mongo");
const createAdmin_auto_1 = require("./utils/scripts/users/createAdmin.auto");
const startServer = async () => {
    await (0, mongo_1.connectMongo)(env_1.env.MONGO_URI, env_1.env.MONGO_DB_NAME);
    await (0, createAdmin_auto_1.createAdmin)();
    const server = http_1.default.createServer(app_1.app);
    server.listen(env_1.env.PORT, () => {
        console.log(`🚀 Server running on http://localhost:${env_1.env.PORT}`);
    });
    const shutdown = async () => {
        console.log("🛑 Shutting down...");
        server.close(() => console.log("✅ HTTP server closed."));
        process.exit(0);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
    return server;
};
exports.startServer = startServer;
