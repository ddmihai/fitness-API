"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = require("../../../../app/app");
const models_1 = require("../models");
const models_2 = require("../../users/models");
const models_3 = __importDefault(require("../../exercises/models"));
describe("Workout sessions feature", () => {
    let mongoServer;
    let authCookie;
    let userId;
    let exerciseAId;
    let exerciseBId;
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        await mongoose_1.default.connect(mongoServer.getUri());
        const user = await models_2.User.create({
            name: "Tester",
            email: "tester@example.com",
            password: "Password123!",
            role: "user",
        });
        userId = user._id;
        const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        authCookie = [`token=${token}`];
        const exercises = await models_3.default.insertMany([
            {
                name: "bench press",
                description: "Chest exercise",
                muscleGroups: ["chest"],
                category: ["strength"],
                equipment: ["barbell"],
            },
            {
                name: "squat",
                description: "Leg exercise",
                muscleGroups: ["legs"],
                category: ["strength"],
                equipment: ["barbell"],
            },
        ]);
        exerciseAId = exercises[0]._id.toString();
        exerciseBId = exercises[1]._id.toString();
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    afterEach(async () => {
        await models_1.WorkoutTemplate.deleteMany({});
        await models_1.WorkoutSession.deleteMany({});
    });
    const buildTemplatePayload = () => ({
        name: "Push Day",
        description: "Upper body focus",
        color: "#FF5733",
        exercises: [
            {
                exerciseId: exerciseAId,
                plannedSets: 4,
                plannedRepsMin: 8,
                plannedRepsMax: 10,
                restSeconds: 90,
                order: 0,
                notes: "Pause at bottom",
            },
            {
                exerciseId: exerciseBId,
                plannedSets: 5,
                plannedRepsMin: 5,
                plannedRepsMax: 6,
                restSeconds: 120,
                order: 1,
            },
        ],
    });
    it("allows a user to manage workout templates", async () => {
        const createResponse = await (0, supertest_1.default)(app_1.app)
            .post("/v1/sessions/templates")
            .set("Cookie", authCookie)
            .send(buildTemplatePayload())
            .expect(201);
        expect(createResponse.body.ok).toBe(true);
        expect(createResponse.body.data.exercises).toHaveLength(2);
        const listResponse = await (0, supertest_1.default)(app_1.app)
            .get("/v1/sessions/templates")
            .set("Cookie", authCookie)
            .expect(200);
        expect(listResponse.body.data).toHaveLength(1);
        const templateId = createResponse.body.data._id;
        const updateResponse = await (0, supertest_1.default)(app_1.app)
            .put(`/v1/sessions/templates/${templateId}`)
            .set("Cookie", authCookie)
            .send({ name: "Updated Push Day" })
            .expect(200);
        expect(updateResponse.body.data.name).toBe("Updated Push Day");
        await (0, supertest_1.default)(app_1.app)
            .delete(`/v1/sessions/templates/${templateId}`)
            .set("Cookie", authCookie)
            .expect(200);
        const afterDelete = await (0, supertest_1.default)(app_1.app)
            .get("/v1/sessions/templates")
            .set("Cookie", authCookie)
            .expect(200);
        expect(afterDelete.body.data).toHaveLength(0);
    });
    it("supports scheduling, completing, and retrieving session history", async () => {
        const templateResponse = await (0, supertest_1.default)(app_1.app)
            .post("/v1/sessions/templates")
            .set("Cookie", authCookie)
            .send(buildTemplatePayload())
            .expect(201);
        const templateId = templateResponse.body.data._id;
        const scheduleResponse = await (0, supertest_1.default)(app_1.app)
            .post("/v1/sessions")
            .set("Cookie", authCookie)
            .send({
            templateId,
            scheduledFor: new Date().toISOString(),
            notes: "Morning workout",
        })
            .expect(201);
        const sessionId = scheduleResponse.body.data._id;
        const listResponse = await (0, supertest_1.default)(app_1.app)
            .get("/v1/sessions")
            .set("Cookie", authCookie)
            .expect(200);
        expect(listResponse.body.data).toHaveLength(1);
        const session = await models_1.WorkoutSession.findById(sessionId);
        const exerciseItem = session?.exercises[0];
        expect(exerciseItem).toBeDefined();
        await (0, supertest_1.default)(app_1.app)
            .post(`/v1/sessions/${sessionId}/complete`)
            .set("Cookie", authCookie)
            .send({
            notes: "Felt strong",
            exercises: [
                {
                    sessionExerciseId: exerciseItem._id,
                    status: "completed",
                    actualSets: [
                        { setNumber: 1, reps: 8, weight: 100 },
                        { setNumber: 2, reps: 8, weight: 100 },
                    ],
                    feedback: "Increase weight next week",
                },
            ],
        })
            .expect(200);
        const historyResponse = await (0, supertest_1.default)(app_1.app)
            .get(`/v1/sessions/history/exercise/${exerciseAId}`)
            .set("Cookie", authCookie)
            .expect(200);
        expect(historyResponse.body.data).toHaveLength(1);
        expect(historyResponse.body.data[0].exercises[0].actualSets).toHaveLength(2);
    });
});
