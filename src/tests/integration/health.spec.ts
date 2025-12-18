import request from "supertest";
import { app } from "../../app/app";

describe("health route", () => {
    it("returns uptime payload", async () => {
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(typeof response.body.uptime).toBe("number");
    });
});
