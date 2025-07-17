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
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = __importDefault(require("./database/db.config"));
const redis_config_1 = require("./config/redis.config");
const create_admin_1 = require("./helpers/seeds/create_admin");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app_1.default);
server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_config_1.default)();
    yield (0, create_admin_1.createAdminUser)();
    yield (0, redis_config_1.connectRedis)();
    console.log(`Server is running on port ${PORT}`);
}));
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received. Closing server...');
    server.close(() => {
        console.log('Server closed gracefully.');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.info('SIGINT signal received. Closing server...');
    server.close(() => {
        console.log('Server closed gracefully.');
        process.exit(0);
    });
});
server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});
