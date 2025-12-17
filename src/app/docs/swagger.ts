import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition: swaggerJsdoc.OAS3Definition = {
    openapi: "3.0.3",
    info: {
        title: "Fitness Tracker API",
        version: "1.0.0",
        description: "HTTP API documentation for the Fitness Tracker backend. Every endpoint below mirrors the current controllers, middlewares, validation, and rate-limiter behavior configured in the source code.",
        contact: {
            name: "Fitness Tracker Team",
            email: "support@example.com",
        },
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local development",
        },
    ],
    tags: [
        { name: "Health", description: "Operational endpoints" },
        { name: "Auth", description: "Authentication and user management" },
        { name: "Exercises", description: "Exercise catalogue management" },
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: "apiKey",
                in: "cookie",
                name: "token",
                description: "JWT issued by the /v1/auth/login endpoint",
            },
        },
        schemas: {
            ErrorResponse: {
                type: "object",
                properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Invalid credentials" },
                    stack: { type: "string", description: "Included only outside production" },
                },
            },
            RateLimitError: {
                type: "object",
                properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Too many requests. Please try again later." },
                },
            },
            HealthResponse: {
                type: "object",
                properties: {
                    ok: { type: "boolean", example: true },
                    uptime: { type: "number", format: "float", example: 42.123 },
                },
            },
            RegisterInput: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string", minLength: 3, maxLength: 50 },
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 8 },
                },
            },
            LoginInput: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: {
                        type: "string",
                        format: "email",
                        description: "Trimmed + lower-cased before lookup",
                    },
                    password: {
                        type: "string",
                        minLength: 8,
                        description: "Trimmed before comparison",
                    },
                },
            },
            User: {
                type: "object",
                properties: {
                    id: { type: "string", example: "665f62ca820b16ca4f587996" },
                    name: { type: "string", example: "Alex Johnson" },
                    email: { type: "string", format: "email" },
                    role: {
                        type: "string",
                        enum: ["admin", "collaborator", "user"],
                        example: "user",
                    },
                    isActive: { type: "boolean", example: true },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
            LoginResponse: {
                type: "object",
                properties: {
                    ok: { type: "boolean", example: true },
                    message: { type: "string", example: "Login successful" },
                },
                description: "Also sets an httpOnly cookie named `token` with a 1 day expiry.",
            },
            ExerciseInput: {
                type: "object",
                required: ["name", "description", "muscleGroups", "category", "equipment"],
                properties: {
                    name: { type: "string", example: "Bench Press" },
                    description: { type: "string", example: "Compound chest movement" },
                    image: { type: "string", format: "uri", nullable: true },
                    muscleGroups: {
                        type: "array",
                        items: { type: "string" },
                        example: ["chest", "triceps"],
                    },
                    category: {
                        type: "array",
                        items: { type: "string" },
                        example: ["strength"],
                    },
                    equipment: {
                        type: "array",
                        items: { type: "string" },
                        example: ["barbell", "bench"],
                    },
                },
            },
            Exercise: {
                allOf: [
                    { $ref: "#/components/schemas/ExerciseInput" },
                    {
                        type: "object",
                        properties: {
                            _id: { type: "string", example: "6660b6212fc720001ec42fcd" },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                            __v: { type: "number", example: 0 },
                        },
                    },
                ],
            },
        },
    },
    paths: {
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Health check",
                description: "Returns process uptime information. No rate limiting is applied to this endpoint.",
                responses: {
                    200: {
                        description: "API is healthy",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/HealthResponse" },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                },
            },
        },
        "/v1/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register",
                description: "Creates a new user account. Rate limited to 20 requests per 15 minutes (`authLimiter`).",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterInput" },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "User created",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        ok: { type: "boolean", example: true },
                                        data: { $ref: "#/components/schemas/User" },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Validation or duplicate email error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    429: {
                        description: "Too many attempts",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RateLimitError" },
                            },
                        },
                    },
                },
            },
        },
        "/v1/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login",
                description: "Authenticates a user and sets a signed `token` httpOnly cookie. Input email/password are trimmed before validation. Rate limited to 20 requests per 15 minutes (`authLimiter`).",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginInput" },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Authenticated",
                        headers: {
                            "Set-Cookie": {
                                description: "token=<jwt>; HttpOnly; Secure (prod); SameSite=Lax; Max-Age=86400",
                                schema: { type: "string" },
                            },
                        },
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/LoginResponse" },
                            },
                        },
                    },
                    400: {
                        description: "Missing or malformed credentials",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    401: {
                        description: "Invalid credentials",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    429: {
                        description: "Too many attempts",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RateLimitError" },
                            },
                        },
                    },
                },
            },
        },
        "/v1/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Current user",
                description: "Requires a valid JWT stored in the `token` cookie. Also rate limited to 20 requests per 15 minutes (`authLimiter`).",
                security: [{ cookieAuth: [] }],
                responses: {
                    200: {
                        description: "Current authenticated user",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        ok: { type: "boolean", example: true },
                                        data: { $ref: "#/components/schemas/User" },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: "Missing/invalid cookie",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    429: {
                        description: "Too many attempts",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RateLimitError" },
                            },
                        },
                    },
                },
            },
        },
        "/v1/exercice/create": {
            post: {
                tags: ["Exercises"],
                summary: "Create exercise",
                description: "Creates an exercise template. Requires admin privileges and is protected by `globalLimiter` (300 requests per 15 minutes per IP).",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ExerciseInput" },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Exercise created",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        ok: { type: "boolean", example: true },
                                        data: { $ref: "#/components/schemas/Exercise" },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Validation error or duplicate name",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    401: {
                        description: "Missing/invalid auth cookie",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    403: {
                        description: "User is not an admin",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    429: {
                        description: "Global rate limit exceeded",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RateLimitError" },
                            },
                        },
                    },
                },
            },
        },
        "/v1/exercice/delete/{id}": {
            delete: {
                tags: ["Exercises"],
                summary: "Delete exercise",
                description: "Removes an exercise by Mongo ObjectId. Requires admin privileges and is protected by `globalLimiter` (300 requests / 15 minutes).",
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string", description: "Mongo ObjectId" },
                    },
                ],
                responses: {
                    200: {
                        description: "Exercise deleted",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        ok: { type: "boolean", example: true },
                                        data: { $ref: "#/components/schemas/Exercise" },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Invalid id",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    401: {
                        description: "Missing/invalid auth cookie",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    403: {
                        description: "User is not an admin",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    404: {
                        description: "Exercise not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    429: {
                        description: "Global rate limit exceeded",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RateLimitError" },
                            },
                        },
                    },
                },
            },
        },
        "/v1/exercice/exercice-detail/{id}": {
            get: {
                tags: ["Exercises"],
                summary: "Exercise detail",
                description: "Fetches one exercise by id. Protected by `globalLimiter` (300 requests / 15 minutes).",
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string", description: "Mongo ObjectId" },
                    },
                ],
                responses: {
                    200: {
                        description: "Exercise detail",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        ok: { type: "boolean", example: true },
                                        data: { $ref: "#/components/schemas/Exercise" },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Invalid id",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    404: {
                        description: "Exercise not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" },
                            },
                        },
                    },
                    429: {
                        description: "Global rate limit exceeded",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RateLimitError" },
                            },
                        },
                    },
                },
            },
        },
        "/v1/exercice/all-exercices": {
            get: {
                tags: ["Exercises"],
                summary: "List active exercises",
                description: "Returns every exercise flagged as active. Protected by `globalLimiter` (300 requests / 15 minutes).",
                responses: {
                    200: {
                        description: "Array of exercises",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        ok: { type: "boolean", example: true },
                                        data: {
                                            type: "array",
                                            items: { $ref: "#/components/schemas/Exercise" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    429: {
                        description: "Global rate limit exceeded",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RateLimitError" },
                            },
                        },
                    },
                },
            },
        },
    },
};

const swaggerOptions: swaggerJsdoc.OAS3Options = {
    definition: swaggerDefinition,
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
