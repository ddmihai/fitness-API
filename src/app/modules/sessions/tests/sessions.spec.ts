import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../../../app/app";
import { WorkoutSession, WorkoutTemplate } from "../models";
import { User } from "../../users/models";
import Exercises from "../../exercises/models";

describe("Workout sessions feature", () => {
    let mongoServer: MongoMemoryServer;
    let authCookie: string[];
    let userId: mongoose.Types.ObjectId;
    let exerciseAId: string;
    let exerciseBId: string;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        const user = await User.create({
            name: "Tester",
            email: "tester@example.com",
            password: "Password123!",
            role: "user",
        });
        userId = user._id;

        const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );
        authCookie = [`token=${token}`];

        const exercises = await Exercises.insertMany([
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
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await WorkoutTemplate.deleteMany({});
        await WorkoutSession.deleteMany({});
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
        const createResponse = await request(app)
            .post("/v1/sessions/templates")
            .set("Cookie", authCookie)
            .send(buildTemplatePayload())
            .expect(201);

        expect(createResponse.body.ok).toBe(true);
        expect(createResponse.body.data.exercises).toHaveLength(2);

        const listResponse = await request(app)
            .get("/v1/sessions/templates")
            .set("Cookie", authCookie)
            .expect(200);

        expect(listResponse.body.data).toHaveLength(1);

        const templateId = createResponse.body.data._id;
        const updateResponse = await request(app)
            .put(`/v1/sessions/templates/${templateId}`)
            .set("Cookie", authCookie)
            .send({ name: "Updated Push Day" })
            .expect(200);

        expect(updateResponse.body.data.name).toBe("Updated Push Day");

        await request(app)
            .delete(`/v1/sessions/templates/${templateId}`)
            .set("Cookie", authCookie)
            .expect(200);

        const afterDelete = await request(app)
            .get("/v1/sessions/templates")
            .set("Cookie", authCookie)
            .expect(200);

        expect(afterDelete.body.data).toHaveLength(0);
    });

    it("supports scheduling, completing, and retrieving session history", async () => {
        const templateResponse = await request(app)
            .post("/v1/sessions/templates")
            .set("Cookie", authCookie)
            .send(buildTemplatePayload())
            .expect(201);

        const templateId = templateResponse.body.data._id;
        const scheduleResponse = await request(app)
            .post("/v1/sessions")
            .set("Cookie", authCookie)
            .send({
                templateId,
                scheduledFor: new Date().toISOString(),
                notes: "Morning workout",
            })
            .expect(201);

        const sessionId = scheduleResponse.body.data._id;

        const listResponse = await request(app)
            .get("/v1/sessions")
            .set("Cookie", authCookie)
            .expect(200);

        expect(listResponse.body.data).toHaveLength(1);

        const session = await WorkoutSession.findById(sessionId);
        const exerciseItem = session?.exercises[0];
        expect(exerciseItem).toBeDefined();

        await request(app)
            .post(`/v1/sessions/${sessionId}/complete`)
            .set("Cookie", authCookie)
            .send({
                notes: "Felt strong",
                exercises: [
                    {
                        sessionExerciseId: exerciseItem!._id,
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

        const historyResponse = await request(app)
            .get(`/v1/sessions/history/exercise/${exerciseAId}`)
            .set("Cookie", authCookie)
            .expect(200);

        expect(historyResponse.body.data).toHaveLength(1);
        expect(historyResponse.body.data[0].exercises[0].actualSets).toHaveLength(2);
    });
});
