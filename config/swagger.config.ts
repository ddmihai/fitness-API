// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';


const routerPath = path.join(__dirname, '..', 'routes', '*.ts');
const controllerPath = path.join(__dirname, '..', 'controllers', '*.ts');



const swaggerOptions: swaggerJSDoc.Options = {
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

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
