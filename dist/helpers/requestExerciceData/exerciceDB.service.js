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
exports.requestExerciseDB = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const env_config_1 = __importDefault(require("../../config/env.config"));
const requestExerciseDB = (_a) => __awaiter(void 0, [_a], void 0, function* ({ endpoint, queryParams = {} }) {
    const url = new URL(`https://exercisedb.p.rapidapi.com/${endpoint}`);
    // Add query parameters to URL
    Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
    });
    try {
        const res = yield (0, node_fetch_1.default)(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-host': env_config_1.default.RAPID_API_HOST,
                'x-rapidapi-key': env_config_1.default.RAPID_API_KEY,
            },
        });
        if (!res.ok) {
            return {
                status: 'error',
                message: `Failed to fetch from ExerciseDB: ${res.status} ${res.statusText}`,
            };
        }
        return yield res.json();
    }
    catch (err) {
        console.error('ExerciseDB fetch error:', err.message);
        throw err;
    }
});
exports.requestExerciseDB = requestExerciseDB;
