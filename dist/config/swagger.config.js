"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/swagger.ts
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const routerPath = path_1.default.join(__dirname, '..', 'routes', '*.ts');
const controllerPath = path_1.default.join(__dirname, '..', 'controllers', '*.ts');
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fitness API manager',
            version: '1.0.0',
            description: 'API documentation using Swagger and JSDoc in TypeScript',
        },
        tags: [
            {
                name: 'Users',
                description: 'User management endpoints',
            },
            {
                name: 'Exercices',
                description: 'Exercice endpoints. Create, update, delete and manage exercices',
            }
        ],
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: [routerPath, './src/controllers/*.ts'], // Adjust based on your project structure
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
exports.default = swaggerSpec;
